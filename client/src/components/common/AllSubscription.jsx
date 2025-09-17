"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const AllSubscriptions = () => {
  const [plans, setPlans] = useState([])
  const [userSubscription, setUserSubscription] = useState(null)
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("authToken")
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get(
          "https://meetix.mahitechnocrafts.in/api/v1/subscription/all",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setPlans(data.subscriptions)
      } catch (err) {
        console.error("Error fetching plans:", err)
        toast.error("Could not load plans.")
      }
    }

    const fetchUserPlans = async () => {
      try {
        const response = await axios.post(
          "https://meetix.mahitechnocrafts.in/api/v1/subscription/my-subscriptions",
          { token },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

    
        )
        const active = response.data.subscriptions?.find(sub => sub.isActive)
        if (active) {
          setUserSubscription({
            id: active._id,
            rate: active.service?.rate,
            serviceId: active.service?._id,
            type: active.service?.type
          })
        }
      } catch (err) {
        console.error("Error fetching user subscriptions:", err)
        toast.error("Could not load your subscription.")
      }
    }

    if (token) {
      fetchPlans()
      fetchUserPlans()
    }
  }, [token])

//  const handleSubscribe = async (plan) => {
//   if (!user?.email) {
//     toast.error("User email not found. Please log in again.");
//     return;
//   }

//   setLoading(true);

//   try {
//     console.log("📦 Creating subscription for plan:", plan);

//     const response = await axios.post(
//       "https://meetix.mahitechnocrafts.in/api/v1/subscription/create",
//       {
//         subscriptionId: plan._id,
//         redirectUrl: `https://www.mahitechnocrafts.in/payment-success?subscriptionId=${plan._id}`,
//         metadata: {
//           email: user.email,
//           userId: user.id || user._id,
//           planType: plan.type
//         }
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     console.log("✅ Subscription creation response:", response.data);

//     if (response.data.redirectUrl) {
//       window.location.href = response.data.redirectUrl; // 🔁 Redirect to Whop
//     } else {
//       toast.error("❌ Failed to start checkout - no redirect URL received");
//     }
//   } catch (error) {
//     console.error("❌ Subscription error:", error);
//     toast.error(error.response?.data?.message || "Failed to start checkout");
//   } finally {
//     setLoading(false);
//   }
// };




const handleSubscribe = async (plan) => {
  if (!user?.email) {
    toast.error("User email not found. Please log in again.");
    return;
  }

  setLoading(true);

  try {
    console.log("📤 Initiating temporary subscription...");

    // Step 1: Call /initiate-subscription API
    await axios.post(
      "https://meetix.mahitechnocrafts.in/api/v1/subscription/initiate-subscription",
      {
        subscriptionId: plan._id,
        userId: user?._id,
        whopPlanId: plan.whopPlanId,
        email: user.email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Temp subscription created.");

    // ✅ Step 2: Redirect to Whop checkout with metadata
    const whopRedirectUrl = `${plan.whopPlanId}?metadata[email]=${encodeURIComponent(user.email)}&metadata[user_id]=${user?._id}`;

    window.location.href = whopRedirectUrl;
  } catch (error) {
    console.error("❌ Subscription error:", error);
    toast.error(error.response?.data?.message || "Failed to start checkout");
  } finally {
    setLoading(false);
  }
};





  const getButtonText = plan => {
    if (!userSubscription) return "Subscribe"
    if (plan._id === userSubscription.serviceId) return "Subscribed"
    if (plan.rate > userSubscription.rate) return "Upgrade"
    if (plan.rate < userSubscription.rate) return "Downgrade"
    return "Change Plan"
  }

  const buttonClasses = type => {
    const map = {
      free: "bg-blue-600 hover:bg-blue-700",
      pro: "bg-green-600 hover:bg-green-700",
      business: "bg-orange-600 hover:bg-orange-700"
    }
    return map[type.toLowerCase()] || "bg-gray-600 hover:bg-gray-700"
  }

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          Please log in to view subscription plans.
        </p>
      </div>
    )
  }
console.log(plans)
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>

      {plans.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading plans...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan._id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col border"
            >
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                {plan.type}
              </h4>
              <p className="text-lg font-bold text-blue-600 mb-4">
                ${plan.rate}/month
              </p>
              <ul className="text-gray-600 mb-6 space-y-2 flex-grow">
                {plan.description.split(",").map((pt, idx) => (
                  <li key={idx}>• {pt.trim()}</li>
                ))}
              </ul>
              <button
              type="button"
               
                onClick={()=>handleSubscribe(plan)}
                className={`w-full ${buttonClasses(
                  plan.type
                )} text-white py-3 px-4 rounded-md transition duration-300 mt-auto disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={userSubscription?.serviceId === plan._id || loading}
              >
                {loading ? "Processing..." : getButtonText(plan)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllSubscriptions
