import axios from "axios";
import { toast } from "react-toastify";
import { subscription } from "../apis"

const { CREATE_PAYMENT, VERIFY_PAYMENT, GET_ALL_SUB } = subscription
// Load the Razorpay SDK from the CDN

export const createOrder = async (type, totalAmount, token) => {
      
  try {
    const orderDetails = { type, totalAmount };
    const { data } = await axios.post(
      CREATE_PAYMENT,
      orderDetails,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // backend responds { orderId }
    return data.orderId;
  } catch (error) {
    toast.error("Failed to create order. Please try again.");
    throw error;
  }
};

export const initiatePayment = async (type, totalAmount, orderId, subscriptionId, token) => {
  try {
    const options = {
      key: "rzp_test_lQz64anllWjB83",
      amount: totalAmount * 100,
      currency: "INR",
      name: `${type} Plan`,
      description: `${type} Subscription`,
      order_id: orderId,
      handler: async (response) => {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
        if (!razorpay_signature) {
          toast.error("Payment verification failed. Please try again.");
          return;
        }
        try {
          await axios.post(
            VERIFY_PAYMENT,
            {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              orderDetails: { type, totalAmount,subscriptionId },
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Payment successful! Subscription activated.");
        } catch {
          toast.error("Verification failed. Please contact support.");
        }
      },
      prefill: {
        // ideally pull from your user context
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch {
    toast.error("Failed to initiate payment.");
  }
};


export const getSubscriptionApi = async (token) => {
    try {
        const response = await axios.get(GET_ALL_SUB, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response?.data?.success) {
            throw new Error(response?.data?.message);
        }
        return response?.data?.subscriptions || [];
    } catch (error) {
        console.error("Error fetching subscriptions:", error.message);
        return [];
    }
};




