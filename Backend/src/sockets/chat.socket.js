import jwt from "jsonwebtoken";
import chatRoomModel from "../models/chatRoom.models.js";
import messageModel from "../models/message.models.js";

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

    // ===== 💬 SEND MESSAGE (UPGRADED) =====
    socket.on("send_message", async (data) => {
      try {
        const { content, chatRoomId, type = "text", fileUrl, replyTo, mentions } = data;

        if (!chatRoomId) return;
        if (type === "text" && (!content || !content.trim())) return;

        // 🔥 get chatroom + workspace
        const chatRoom = await chatRoomModel
          .findById(chatRoomId)
          .populate({
            path: "workspaceId",
            select: "plan"
          });

        if (!chatRoom) return;

        if (replyTo) {
  const originalMessage = await messageModel.findById(replyTo);

  if (!originalMessage) {
    return socket.emit("error", "Original message not found");
  }

  // 🔥 ensure same chatroom
  if (originalMessage.chatRoomId.toString() !== chatRoomId) {
    return socket.emit("error", "Invalid reply target");
  }
}

        const workspace = chatRoom.workspaceId;
        const features = workspace.plan.features;

        // ✅ membership check
        const isMember = chatRoom.members.some(
          m => m.toString() === socket.userId
        );

        if (!isMember) return;

        // ===== 🔥 FEATURE CHECKS =====

        // file
        if (type === "file" && !features.fileUpload) {
          return socket.emit("error", "File upload not allowed in your plan");
        }

        // reply
        if (replyTo && !features.replyMessage) {
          return socket.emit("error", "Reply feature not available");
        }

        // mentions
        if (mentions?.length && !features.mentions) {
          return socket.emit("error", "Mentions not allowed in your plan");
        }

        if (mentions?.length) {

  // remove duplicates
  const uniqueMentions = [...new Set(mentions)];

  // check all users are part of chatroom
  const invalidUsers = uniqueMentions.filter(
    userId => !chatRoom.members.some(
      m => m.toString() === userId
    )
  );

  if (invalidUsers.length > 0) {
    return socket.emit("error", "Invalid users in mentions");
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
          mentions
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

        // optional ack
        socket.emit("message_sent", populated);

      } catch (err) {
        console.error("SEND ERROR:", err);
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