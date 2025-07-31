import axios from "axios";
import { toast } from "react-toastify";
import { order } from "../apis"

const { CREATE_PAYMENT, VERIFY_PAYMENT, GET_ORDERS, GET_SINGLE_ORDERS } = order

export const createOrder = async (totalAmount, token) => {
    try {
        const orderDetails = {
            totalAmount, // Pass total amount for backend
        };

        const { data } = await axios.post(CREATE_PAYMENT, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.orderId;
    } catch (error) {
        toast.error("Failed to create the order. Please try again.");
        throw new Error(error);
    }
};




export const initiatePayment = async (productId, contact, totalAmount, address, orderId, quantity, token, productName) => {
    try {
        const options = {
            key: "rzp_test_lQz64anllWjB83",
            amount: totalAmount * 100,
            currency: "INR",
            name: productName,
            contact: contact,
            address: address,
            description: `Product Order`,
            order_id: orderId,
            handler: async function (response) {
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
                            orderDetails: { productId, contact, totalAmount, address, quantity, productName },
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    toast.success("Payment successful! Order Placed.");
                } catch (error) {
                    console.error("Verification error:", error);
                    toast.error("Payment verification failed. Please contact support.");
                }
            },
            prefill: {
                name: "John Doe", // Customize based on your user data
                email: "johndoe@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error("Payment initiation error:", error);
        toast.error("Failed to initiate payment. Please try again.");
    }
};




export const fetchOrders = async (token) => {
    try {
        const response = await axios.get(GET_ORDERS, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("API Response:", response); // Log the full response object

        return response.data?.orders || []; // Make sure you're returning orders
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders.");
    }
};

export const fetchSingleOrders = async (token, userId) => {
    try {
        const response = await axios.get(
            `${GET_SINGLE_ORDERS}/${userId}`, // Send userId as a route parameter
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("API Response:", response);
        return response.data?.order || [];
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders.");
    }
};

