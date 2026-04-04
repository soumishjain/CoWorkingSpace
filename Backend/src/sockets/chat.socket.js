import jwt from "jsonwebtoken";
import chatRoomModel from "../models/chatRoom.models.js";
import { PLANS } from "../utils/plans.js";

export const initSocket = (io) => {

  // 🔐 AUTH
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  // 🔌 CONNECTION
  io.on("connection", (socket) => {
    console.log("🟢 CONNECTED:", socket.userId);

    // ===== 🧠 JOIN CHATROOM =====
    socket.on("join_chatroom", async ({ chatRoomId }) => {
      try {
        if (!chatRoomId) return;

        const chatRoom = await chatRoomModel.findById(chatRoomId);
        if (!chatRoom) return;

        const isMember = chatRoom.members.some(
          m => m.toString() === socket.userId
        );

        if (!isMember) return;

        socket.join(chatRoomId.toString());

      } catch (err) {
        console.error("JOIN ERROR:", err);
      }
    });

    // ===== 🚪 LEAVE =====
    socket.on("leave_chatroom", ({ chatRoomId }) => {
      if (!chatRoomId) return;
      socket.leave(chatRoomId.toString());
    });

    // ===== 💬 SEND MESSAGE =====
    socket.on("send_message", async (data) => {
      try {
        const {
          content,
          chatRoomId,
          type = "text",
          fileUrl,
          replyTo,
          mentions
        } = data;

        if (!chatRoomId) return;

        if (type === "text" && !content?.trim()) return;

        // 🔥 GET CHATROOM
        const chatRoom = await chatRoomModel.findById(chatRoomId);
        if (!chatRoom) return;

        // 🔥 GET PLAN PROPERLY
        const workspacePlanKey = chatRoom.workspacePlan || chatRoom.plan || "individual";
        const plan = PLANS[workspacePlanKey];
        const features = plan.features;

        // ✅ MEMBERSHIP CHECK
        const isMember = chatRoom.members.some(
          m => m.toString() === socket.userId
        );
        if (!isMember) return;

        // ===== 🔥 FEATURE CHECKS =====

        // file validation
        if (type === "file") {
          if (!fileUrl) {
            return socket.emit("chat_error", { message: "File URL required" });
          }

          if (!features.fileUpload) {
            return socket.emit("chat_error", { message: "File upload not allowed" });
          }
        }

        // reply validation
        if (replyTo) {
          if (!features.replyMessage) {
            return socket.emit("chat_error", { message: "Reply not allowed" });
          }

          const originalMessage = await messageModel.findById(replyTo);

          if (!originalMessage) {
            return socket.emit("chat_error", { message: "Original message not found" });
          }

          if (originalMessage.chatRoomId.toString() !== chatRoomId) {
            return socket.emit("chat_error", { message: "Invalid reply target" });
          }
        }

        // mentions validation
        let cleanMentions = [];

        if (mentions?.length) {
          if (!features.mentions) {
            return socket.emit("chat_error", { message: "Mentions not allowed" });
          }

          cleanMentions = [...new Set(mentions)];

          const invalidUsers = cleanMentions.filter(
            userId => !chatRoom.members.some(
              m => m.toString() === userId
            )
          );

          if (invalidUsers.length > 0) {
            return socket.emit("chat_error", { message: "Invalid mention users" });
          }
        }

        // ===== 💾 CREATE MESSAGE =====
        const message = await messageModel.create({
          content: content?.trim(),
          senderId: socket.userId,
          chatRoomId,
          type,
          fileUrl,
          replyTo,
          mentions: cleanMentions
        });

        // ===== 🔥 POPULATE =====
        const populated = await messageModel
          .findById(message._id)
          .populate("senderId", "name profileImage")
          .populate("mentions", "name profileImage")
          .populate({
            path: "replyTo",
            populate: {
              path: "senderId",
              select: "name profileImage"
            }
          });

        // ===== 📡 EMIT =====
        io.to(chatRoomId.toString()).emit("receive_message", populated);

        socket.emit("message_sent", populated);

      } catch (err) {
        console.error("SEND ERROR:", err);
        socket.emit("chat_error", { message: "Message send failed" });
      }
    });

    // ===== ✍️ TYPING =====
    socket.on("typing", ({ chatRoomId }) => {
      socket.to(chatRoomId).emit("typing", {
        userId: socket.userId
      });
    });

    socket.on("stop_typing", ({ chatRoomId }) => {
      socket.to(chatRoomId).emit("stop_typing", {
        userId: socket.userId
      });
    });

    // ===== ❌ DISCONNECT =====
    socket.on("disconnect", () => {
      console.log("🔴 DISCONNECTED:", socket.userId);
    });
  });
};