const subscriptionModel = require("../models/subscription")
const crypto = require("crypto");
const { razorpayInstance } = require("../config/ragorpay");
const authModel = require("../models/User")
const whopSdk = require("../config/whop");


const createSubscriptionCtrl = async (req, res) => {
  try {
    const { subscriptionId, metadata } = req.body;
    console.log("🟢 Received request for subscription:", req.body);

    // Validate required fields
    if (!subscriptionId) {
      return res.status(400).json({
        message: "❌ Missing required field: subscriptionId",
      });
    }

    // Fetch subscription from database
    const subscription = await subscriptionModel.findById(subscriptionId);
    console.log("📦 Fetched subscription from DB:", subscription);

    if (!subscription) {
      return res.status(404).json({
        message: "❌ Subscription not found in database",
      });
    }

    if (!subscription.whopPlanId) {
      return res.status(400).json({
        message: "❌ Whop Plan ID not configured for this subscription",
      });
    }

    // Create checkout session with Whop
    const sessionPayload = {
      planId: subscription.whopPlanId,
      metadata: metadata || {}
    };

    console.log("🚀 Creating Whop checkout session with:", sessionPayload);

    const session = await whopSdk.payments.createCheckoutSession(sessionPayload);

    console.log("✅ Whop session created:", session);

    if (!session || !session.id) {
      return res.status(500).json({
        message: "❌ Failed to create checkout session with Whop - no session ID returned",
      });
    }

    // Return the checkout URL
    const redirectUrl = `https://whop.com/checkout/${session.id}`;
    return res.status(200).json({
  success: true,
  sessionId: session.id,
  redirectUrl: `https://whop.com/checkout/${session.id}`,
  message: "✅ Checkout session created successfully",
});


  } catch (error) {
    console.error("❌ Whop createCheckoutSession error:", error);

    if (error.response) {
      console.error("🧨 Whop API response error:", error.response.data);
      return res.status(error.response.status || 500).json({
        message: "Whop API error",
        error: error.response.data?.message || error.message,
        details: error.response.data,
      });
    }

    return res.status(500).json({
      message: "❌ Failed to create checkout session",
      error: error.message,
    });
  }
};


const verifyPaymentCtrl = async (req, res) => {
  try {
    const { license_id, subscriptionId } = req.body
    const userId = req.user.id

    console.log("Verifying payment:", { license_id, subscriptionId, userId })

    if (!license_id || !subscriptionId) {
      return res.status(400).json({
        message: "Missing license_id or subscriptionId",
      })
    }

    // Fetch subscription from database
    const subscription = await subscriptionModel.findById(subscriptionId)
    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      })
    }

    // Verify license with Whop
    try {
      const license = await whopSdk.licenses.retrieve(license_id)
      console.log("Retrieved license:", license)

      if (!license || license.status !== "active") {
        return res.status(400).json({
          message: "Invalid or inactive license",
        })
      }

      const enrollmentDate = new Date(license.created_at)
      const expirationDate = license.expires_at
        ? new Date(license.expires_at)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days

      // Update user subscription
      await authModel.findByIdAndUpdate(userId, {
        $push: {
          subscriptions: {
            service: subscription._id,
            enrollmentDate,
            expirationDate,
            isActive: true,
            transaction_id: license.id,
            payable: subscription.rate,
            expiryMail: 0,
          },
        },
      })

      // Update subscription users
      await subscriptionModel.findByIdAndUpdate(subscriptionId, {
        $push: {
          usersEnroled: {
            user: userId,
            enrollmentDate,
            expirationDate,
            transaction_id: license.id,
            payable: subscription.rate,
            expiryMail: 0,
          },
        },
      })

      return res.status(200).json({
        success: true,
        message: "License verified and subscription activated successfully",
        subscription: {
          id: subscription._id,
          type: subscription.type,
          expirationDate,
        },
      })
    } catch (whopError) {
      console.error("Whop license verification error:", whopError)
      return res.status(400).json({
        message: "Failed to verify license with Whop",
        error: whopError.message,
      })
    }
  } catch (error) {
    console.error("Error in verifyPaymentCtrl:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}


const getAllSubctrl = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel
      .find({})
      .populate("usersEnroled.user"); // Populate enrolled users

    return res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error("Error in getAllSubctrl:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getting subscriptions",
    });
  }
};




const createSubscription = async (req, res) => {
  try {
    const {
      type,
      description,
      rate,
      totalAmount,
      limit,
      whopPlanId
      } = req.body;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month validity

    const subscription = await subscriptionModel.create({
      type,
      description,
      rate,
   totalAmount,
   limit,
      startDate,
      endDate,
      whopPlanId,
      isActive: true,
    });

    res.status(201).json({ success: true, subscription });
  } catch (error) {
    console.error("Create Subscription Error:", error);
    res.status(500).json({ success: false, message: "Failed to create subscription" });
  }
};
const editSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      description,
      rate,
      totalAmount,
      limit,
      whopPlanId
    } = req.body;
console.log("first")
    const updatedSubscription = await subscriptionModel.findByIdAndUpdate(
      id,
      {
        type,
        description,
        rate,
        totalAmount,
        limit,
        whopPlanId
      },
      { new: true } // returns the updated document
    );

    if (!updatedSubscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    res.status(200).json({ success: true, subscription: updatedSubscription });
  } catch (error) {
    console.error("Edit Subscription Error:", error);
    res.status(500).json({ success: false, message: "Failed to update subscription" });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
   const subscriptions = await subscriptionModel
      .find({})
      .populate("usersEnroled.user"); // Populate enrolled users

    res.status(200).json({ success: true, subscriptions });
  } catch (error) {
    console.error("Get All Subscriptions Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch subscriptions" });
  }
};



const getUserSubscriptionsCtrl = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await authModel.findById(userId)
      .populate({
        path: "subscriptions.service",
        model: "Subscriptions", // make sure your subscription model name is correct
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      subscriptions: user.subscriptions,
    });
  } catch (error) {
    console.error("Error in getUserSubscriptionsCtrl:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user subscriptions" });
  }
};


const addMeetingToUser = async (userId, roomId) => {
  try {
    // 1. Add to `meetings`
    await authModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          meetings: {
            roomId,
            joinedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    // 2. Update the corresponding upcoming meeting
    await authModel.updateOne(
      { _id: userId, "upCommingMeetings.roomId": roomId },
      {
        $set: {
          "upCommingMeetings.$.isJoined": true,
          "upCommingMeetings.$.joinedAt": new Date(),
        },
      }
    );
  } catch (err) {
    console.error("Error adding meeting to user:", err);
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await authModel.find()
      .populate({
        path: 'subscriptions.service',
        model: 'Subscriptions', // Must match your Subscriptions model name
      })
      .sort({ createdAt: -1 }); // Optional: recent users first

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
};


const deleteSubscriptionCtrl = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    if (!subscriptionId) {
      return res.status(400).json({ message: "Missing subscriptionId" });
    }

    const deletedSubscription = await subscriptionModel.findByIdAndDelete(subscriptionId);

    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return res.status(500).json({ message: "Failed to delete subscription", error: error.message });
  }
};

module.exports = { 
    createSubscriptionCtrl, 
    verifyPaymentCtrl, 
    getAllSubctrl,
    createSubscription,
    getAllSubscriptions,
    getUserSubscriptionsCtrl,
    addMeetingToUser,
    getAllUsers,
    editSubscription,
    deleteSubscriptionCtrl
 }
