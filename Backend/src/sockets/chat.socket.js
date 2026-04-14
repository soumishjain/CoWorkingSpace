import jwt from "jsonwebtoken";
import chatRoomModel from "../models/chatRoom.models.js";
import messageModel from "../models/message.models.js";
import workspaceModel from "../models/workspace.models.js";
import { PLANS } from "../utils/plans.js";

const activeCalls = new Map(); // optional feature

export const initSocket = (io) => {

  // ================= AUTH =================
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      console.log("🔑 TOKEN:", token);

      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      console.log("✅ AUTH SUCCESS:", socket.userId);

      next();
    } catch (err) {
      console.log("❌ AUTH ERROR:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 CONNECTED:", socket.userId);

    // ================= JOIN ROOM =================
    socket.on("join_chatroom", async ({ chatRoomId }) => {
      try {
        console.log("➡️ JOIN REQUEST:", chatRoomId);

        const room = await chatRoomModel.findOne({
          _id: chatRoomId,
          members: socket.userId,
        });

        if (!room) {
          console.log("❌ JOIN FAILED (NOT MEMBER)");
          return;
        }

        socket.join(chatRoomId.toString());

        console.log("✅ JOINED ROOM:", chatRoomId);

        socket.to(chatRoomId).emit("user_joined_room", {
          userId: socket.userId,
        });

      } catch (err) {
        console.log("💥 JOIN ERROR:", err.message);
      }
    });

    // ================= LEAVE ROOM =================
    socket.on("leave_chatroom", ({ chatRoomId }) => {
      console.log("🚪 LEAVE ROOM:", chatRoomId);

      socket.leave(chatRoomId?.toString());

      socket.to(chatRoomId).emit("user_left_room", {
        userId: socket.userId,
      });
    });

    // ================= SEND MESSAGE =================
    socket.on("send_message", async (data) => {
      try {
        console.log("📥 RAW MESSAGE:", data);

        const {
          content,
          chatRoomId,
          type = "text",
          fileName,
          replyTo,
          mentions,
        } = data;

        console.log("📦 PARSED:", {
          content,
          type,
          fileName,
        });

        // ===== CHECK ROOM =====
        const chatRoom = await chatRoomModel.findOne({
          _id: chatRoomId,
          members: socket.userId,
        });

        if (!chatRoom) {
          console.log("❌ USER NOT IN ROOM");
          return;
        }

        // ===== WORKSPACE + PLAN =====
        const workspace = await workspaceModel
          .findById(chatRoom.workspaceId)
          .populate("plan");

          console.log("Workspace: " ,workspace)

        const features = PLANS[workspace?.plan].features || {};

        // ===== VALIDATION =====
        if (type === "text" && !content?.trim()) {
          console.log("❌ EMPTY TEXT");
          return;
        }

        if (type !== "text" && !content) {
          console.log("❌ FILE BUT NO URL");
          return;
        }

        if (type !== "text" && !features.fileUpload) {
          console.log(features)
        console.log("❌ NON-TEXT MESSAGE BLOCKED BY PLAN");

        return socket.emit("chat_error", {
          message: "Only text messages allowed in your plan",
        });
      }

        if (replyTo && !features.replyMessage) {
          console.log("❌ REPLY BLOCKED");
          return socket.emit("chat_error", {
            message: "Reply not allowed",
          });
        }

        if (mentions?.length && !features.mentions) {
          console.log("❌ MENTIONS BLOCKED");
          return socket.emit("chat_error", {
            message: "Mentions not allowed",
          });
        }

        // ===== FINAL CONTENT FIX =====
        const finalContent =
          type === "text"
            ? content.trim()
            : content; // 🔥 URL for image/file

        console.log("🔥 FINAL CONTENT:", finalContent);

        // ===== SAVE =====
        const message = await messageModel.create({
          content: finalContent,
          senderId: socket.userId,
          chatRoomId,
          type,
          fileName,
          replyTo,
          mentions: mentions || [],
        });

        console.log("💾 MESSAGE SAVED:", message._id);

        // ===== POPULATE =====
        const populated = await messageModel
          .findById(message._id)
          .populate("senderId", "name email");

        console.log("📤 EMITTING:", populated);

        // ===== EMIT =====
        io.to(chatRoomId).emit("receive_message", populated);

      } catch (err) {
        console.log("💥 SEND ERROR:", err.message);
        socket.emit("chat_error", { message: "Send failed" });
      }
    });

    // ================= DELETE MESSAGE =================
    socket.on("delete_message", async ({ messageId }) => {
      try {
        console.log("🗑 DELETE REQUEST:", messageId);

        const message = await messageModel.findById(messageId);

        if (!message) {
          console.log("❌ MESSAGE NOT FOUND");
          return;
        }

        if (message.senderId.toString() !== socket.userId) {
          console.log("❌ NOT OWNER");
          return;
        }

        await messageModel.deleteOne({ _id: messageId });

        console.log("✅ MESSAGE DELETED");

        io.to(message.chatRoomId.toString()).emit(
          "message_deleted",
          { messageId }
        );

      } catch (err) {
        console.log("💥 DELETE ERROR:", err.message);
      }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("🔴 DISCONNECTED:", socket.userId);
    });
  });
};