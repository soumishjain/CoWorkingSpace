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

  // 🔥 FIXED TYPE ENUM
  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "file", "system"], // ✅ ADDED
    default: "text",
  },

  fileName: String, // 🔥 ADD THIS (tu use kar raha hai frontend me)

  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },

  mentions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true });

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;