import { toast } from "react-toastify"

import { apiConnector } from "../apiConnector"
import { paymentEndpoints } from "../apis"
import rzpLogo from "../../logo.png"
import { resetCart } from "../../redux/cartSlice"

const {
    PRODUCT_PAYMENT_API,
    PRODUCT_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
    GET_ALL_ORDER
} = paymentEndpoints


// Load the Razorpay SDK from the CDN
function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  


  // Buy Product

  export async function BuyProduct(
    token,
    products,
    address,
    payable,
    user_details,
    navigate,
    dispatch
  ) {

    console.log(products)
    const toastId = toast.loading("Loading...")
    try {
      // Loading the script of Razorpay SDK
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
  
      if (!res) {
        toast.error(
          "Razorpay SDK failed to load. Check your Internet Connection."
        )
        return
      }
  
      // Initiating the Order in Backend
      const orderResponse = await apiConnector(
        "POST",
        PRODUCT_PAYMENT_API,
        {
            products,
            payable,
         
        },
        {
          Authorization: `Bearer ${token}`,
        }
      )
  
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message)
      }
    //   console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)
      // Opening the Razorpay SDK
      const options = {
        // key: process.env.RAZORPAY_KEY,
        key: "rzp_test_lQz64anllWjB83",
  
        currency: orderResponse.data.data.currency,
        amount: `${orderResponse.data.data.amount}`,
        order_id: orderResponse.data.data.id,
        name: "Absence",
        description: "Thank you for Purchasing the Products.",
        image: rzpLogo,
        prefill: {
          name: `${user_details.name} `,
          email: user_details.email,
        },
        handler: function (response) {
        //   sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
          verifyPayment({ ...response, products,address,payable }, token, navigate, dispatch)
        },
      }
      const paymentObject = new window.Razorpay(options)
  
      paymentObject.open()
      paymentObject.on("payment.failed", function (response) {
        toast.error("Oops! Payment Failed.")
        console.log(response.error)
      })
    } catch (error) {
      console.log("PAYMENT API ERROR............", error)
      toast.error("Could Not make Payment.") 
    }
    toast.dismiss(toastId)
  }


// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...")
    console.log("enter verify")
    // dispatch(setPaymentLoading(true))
    try {
      const response = await apiConnector("POST", PRODUCT_VERIFY_API, bodyData, {
        Authorization: `Bearer ${token}`,
      })
  
      console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
  
      toast.success("Payment Successful. Order Placed ")
      navigate("/")
      dispatch(resetCart())

    } catch (error) {
      console.log("PAYMENT VERIFY ERROR............", error)
      toast.error("Could Not Verify Payment.")
    }
    toast.dismiss(toastId)
    // dispatch(setPaymentLoading(false))
  }







  // Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
      await apiConnector(
        "POST",
        SEND_PAYMENT_SUCCESS_EMAIL_API,
        {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          amount,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      )
    } catch (error) {
      console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
    }
  }
  

    export const getAllOrder = () => async (token) => {
      const toastId = toast.loading("Loading...");

      try {
        const response = await apiConnector("GET", GET_ALL_ORDER,null, {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        });
        console.log(response)
        if (!response?.data?.success) {
          throw new Error("Could Not Fetch Product");
        }
        const result = response?.data?.orders;
      // Dispatching action to save products
        toast.dismiss(toastId);
        return result;
      } catch (error) {
        console.log("GET_ALL_ORDER_API API ERROR:", error);
        toast.error(error.message);
        toast.dismiss(toastId);
        return [];
      }
    };