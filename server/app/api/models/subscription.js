const mongoose = require("mongoose");

const subscriptionsSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    whopPlanId: {
      type: String,
    
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      default:0
    },
    totalAmount: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },



    usersEnroled: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
          required: true,
        },
        expirationDate: {
          type: Date,
          required: true,
        },

        transaction_id: { // Add this field
          type: String,
        },
        payable: { // Add this field
          type: Number,
          required: true,
        },
        expiryMail: {
          type: Number,
          default: 0
        }
      },
    ],


  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscriptions", subscriptionsSchema);
