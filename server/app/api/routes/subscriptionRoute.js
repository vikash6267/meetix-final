const express = require("express");
const { auth } = require("../middleware/auth");
const { createSubscriptionCtrl, verifyPaymentCtrl, getAllSubctrl, createSubscription, getAllSubscriptions, getUserSubscriptionsCtrl, getAllUsers, editSubscription, deleteSubscriptionCtrl } = require("../controllers/subscriptionCtrl")
const router = express.Router();


const TempWhopSubscription = require('../models/TempWhopSubscription');
const authModel = require('../models/User'); // replace with your actual model
const subscriptionModel = require('../models/subscription'); // replace with your actual model

router.post("/webhook", async (req, res) => {
  console.log("📩 Received WHOP webhook at:", new Date().toISOString());
  console.log("🛠️ Raw Body:", req.body);

  try {
    const data = req.body?.data;

    if (!data) {
      console.log("❌ No `data` object found in webhook payload.");
      return res.status(400).json({ message: "Invalid payload" });
    }

    const planId = data.plan_id;
    const email = data.user_email;
    const paymentId = data.id;
    const createdAt = new Date((data.created_at || Date.now()) * 1000);

    console.log("🔍 Extracted → planId:", planId);
    console.log("🔍 Extracted → email:", email);

    if (!planId) {
      console.log("❌ plan_id is missing in webhook data.");
      return res.status(400).json({ message: "Missing plan_id" });
    }

    let match = null;

    if (email) {
      match = await TempWhopSubscription.findOne({
        whopPlanId: { $regex: planId, $options: "i" },
        email,
        isSubscribed: false,
      });
    }

    if (!match) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      match = await TempWhopSubscription.findOne({
        whopPlanId: { $regex: planId, $options: "i" },
        isSubscribed: false,
     
      });
    }

    if (!match) {
      console.log("❌ No match found in temp DB");
      return res.status(404).json({ message: "No matching temp subscription found" });
    }

    const { userId, subscriptionId } = match;

    if (!userId || !subscriptionId) {
      console.log("❌ userId or subscriptionId missing in matched temp record");
      return res.status(400).json({ message: "Incomplete temp subscription data" });
    }

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) {
      console.log("❌ Subscription not found for ID:", subscriptionId);
      return res.status(404).json({ message: "Subscription not found" });
    }

    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // ✅ Enroll user in authModel
    await authModel.findByIdAndUpdate(userId, {
      $push: {
        subscriptions: {
          service: subscription._id,
          enrollmentDate: createdAt,
          expirationDate,
          isActive: true,
          transaction_id: paymentId,
          payable: subscription.rate || 0,
          expiryMail: 0,
        },
      },
    });

    // ✅ Update subscription model
    await subscriptionModel.findByIdAndUpdate(subscriptionId, {
      $push: {
        usersEnroled: {
          user: userId,
          enrollmentDate: createdAt,
          expirationDate,
          transaction_id: paymentId,
          payable: subscription.rate || 0,
          expiryMail: 0,
        },
      },
    });

    // ✅ Mark temp as subscribed
    match.isSubscribed = true;
    await match.save();

    console.log("🎉 User enrolled successfully:", userId);
    return res.status(200).json({ success: true, message: "Webhook processed and user enrolled" });

  } catch (err) {
    console.error("💥 Webhook handler error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});




// Called from UI on subscription button click
router.post("/initiate-subscription", async (req, res) => {
  const { userId, email, subscriptionId, whopPlanId } = req.body;
console.log(userId, email, subscriptionId, whopPlanId)

  if (!userId || !email || !subscriptionId || !whopPlanId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  await TempWhopSubscription.create({
    userId,
    email,
    subscriptionId,
    whopPlanId,
  });

  res.json({ message: "Subscription initialized." });
});



router.post("/create",  createSubscriptionCtrl);
router.post("/payment-success", auth, verifyPaymentCtrl);
router.get("/getAll", auth, getAllSubctrl);

router.post("/maincreate", createSubscription);
router.post("/edit/:id", editSubscription);
router.get("/all", getAllSubscriptions);
router.post("/my-subscriptions", auth, getUserSubscriptionsCtrl);
router.get('/users', getAllUsers);
router.delete('/:subscriptionId', deleteSubscriptionCtrl);

// router.post("/webhook", (req, res) => {
//   console.log("📩 Webhook hit!");

//   const body = req.body;

//   if (!body) {
//     console.log("❌ No body received in webhook");
//     return res.status(400).json({ success: false, message: "No data received" });
//   }

//   // Optional: show full event type and data
//   const eventType = body.event || "unknown_event";
//   const data = body.data || {};

//   console.log("✅ Event Type:", eventType);
//   console.log("📦 Data:", JSON.stringify(data, null, 2));

//   // Example: access subscription_id and user.id (WHOP specific)
//   if (eventType === "subscription_created") {
//     const subscID = data.subscription_id;
//     const userID = data.user?.id;

//     console.log("🆔 Subscription ID:", subscID);
//     console.log("👤 User ID:", userID);
//   }

//   res.status(200).json({ success: true, message: "Webhook received" });
// });
module.exports = router;
