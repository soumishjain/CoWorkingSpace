import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: "Workspace",
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

chatRoomSchema.index({ workspaceId: 1, departmentId: 1, name: 1 }, { unique: true });

const chatRoomModel = mongoose.model("ChatRoom", chatRoomSchema);

export default chatRoomModel