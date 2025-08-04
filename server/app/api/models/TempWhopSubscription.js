const mongoose = require('mongoose');

const tempWhopSubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: String,
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  whopPlanId: String,
  isSubscribed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TempWhopSubscription", tempWhopSubscriptionSchema);