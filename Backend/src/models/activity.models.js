import mongoose from "mongoose"

const activitySchema = new mongoose.Schema({

  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
    index: true
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null, // 🔥 IMPORTANT (workspace level ke liye)
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  }

}, { timestamps: true })

// 🔥 indexes
activitySchema.index({ workspaceId: 1, createdAt: -1 })
activitySchema.index({ departmentId: 1, createdAt: -1 })

const activityModel = mongoose.model("Activity", activitySchema)

export default activityModel