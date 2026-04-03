import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: String,

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
  },

  // 🔥 NEW FEATURES
  type: {
    type: String,
    enum: ["text", "file", "system"],
    default: "text"
  },

  fileUrl: String,

  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  },

  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]

}, { timestamps: true });

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel