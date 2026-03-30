import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
    unique: true,
    index: true
  },

  plan: {
    type: String,
    enum: ["individual", "startup", "company", "bigtech"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "active", "cancelled", "expired"],
    default: "pending",
    index: true
  },

  startDate: {
    type: Date,
    default: Date.now
  },

  endDate: {
    type: Date
  },

  isReadOnly: {
    type: Boolean,
    default: false
  },

  paymentId: {
    type: String,
  },

  orderId: {
    type: String
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  }

}, {
  timestamps: true
});

const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);
export default subscriptionModel;