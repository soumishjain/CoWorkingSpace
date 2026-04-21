import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  plan: {
    type: String,
    enum: ["individual", "startup", "company", "bigtech"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  status: {
    type: String,
    enum: ["created", "success", "failed"],
    default: "created",
    index: true
  },

  paymentId: {
    type: String,
    unique: true,
    sparse: true // 🔥 allow null but unique when exists
  },

  orderId: {
    type: String,
    required: true,
    index: true
  },

  method: {
    type: String // card / upi / netbanking (optional)
  },

  failureReason: {
    type: String
  }

}, {
  timestamps: true
});

const paymentModel = mongoose.model("Payment", paymentSchema);
export default paymentModel;