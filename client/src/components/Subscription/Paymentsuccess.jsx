import { useEffect } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  useEffect(() => {
    const license_id = new URLSearchParams(window.location.search).get("license_id");
    const subscriptionId = new URLSearchParams(window.location.search).get("subscriptionId");

    if (license_id && subscriptionId) {
      axios.post("https://meetix.mahitechnocrafts.in/api/subscription/payment-success", {
        license_id,
        subscriptionId,
      })
      .then((res) => {
        console.log("Subscription verified:", res.data.message);
      })
      .catch((err) => {
        console.error("Verification failed:", err);
      });
    }
  }, []);

  return <div>🎉 Payment Successful! Verifying your subscription...</div>;
};

export default PaymentSuccess;
