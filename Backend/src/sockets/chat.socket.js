import jwt from "jsonwebtoken";
import chatRoomModel from "../models/chatRoom.models.js";
import messageModel from "../models/message.models.js";
import workspaceModel from "../models/workspace.models.js";
import { PLANS } from "../utils/plans.js";

export const initSocket = (io) => {

  /* ================= AUTH ================= */
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {

    /* ================= JOIN ROOM ================= */
    socket.on("join_chatroom", async ({ chatRoomId }) => {
      const room = await chatRoomModel.findOne({
        _id: chatRoomId,
        members: socket.userId,
      });

      if (!room) return;

      socket.join(chatRoomId.toString());
    });

    /* ================= LEAVE ROOM ================= */
    socket.on("leave_chatroom", ({ chatRoomId }) => {
      socket.leave(chatRoomId?.toString());
    });

    /* ================= SEND MESSAGE ================= */
    socket.on("send_message", async (data) => {
      try {
        const {
          content,
          chatRoomId,
          type = "text",
          fileName,
          replyTo,
          mentions,
        } = data;

        const chatRoom = await chatRoomModel.findOne({
          _id: chatRoomId,
          members: socket.userId,
        });

        if (!chatRoom) return;

        const workspace = await workspaceModel.findById(chatRoom.workspaceId);
        if (!workspace) return;

        const features = PLANS[workspace.plan]?.features || {};

        /* ===== VALIDATION ===== */
        if (type === "text" && !content?.trim()) return;
        if (type !== "text" && !content) return;

        if (type !== "text" && !features.fileUpload) {
          return socket.emit("chat_error", {
            message: "File not allowed",
          });
        }

        if (replyTo && !features.replyMessage) {
          return socket.emit("chat_error", {
            message: "Reply not allowed",
          });
        }

        if (mentions?.length && !features.mentions) {
          return socket.emit("chat_error", {
            message: "Mentions not allowed",
          });
        }

        /* ===== REPLY VALIDATION ===== */
        let replyMessage = null;

        if (replyTo) {
          replyMessage = await messageModel.findById(replyTo);

          if (!replyMessage) {
            return socket.emit("chat_error", {
              message: "Invalid reply message",
            });
          }
        }

        /* ===== CREATE ===== */
        const message = await messageModel.create({
          content: type === "text" ? content.trim() : content,
          senderId: socket.userId,
          chatRoomId,
          type,
          fileName,
          replyTo: replyMessage?._id || null,
          mentions: mentions || [],
        });

        /* ===== POPULATE ===== */
        const populated = await messageModel
          .findById(message._id)
          .populate("senderId", "name email role")
          .populate({
            path: "replyTo",
            populate: {
              path: "senderId",
              select: "name email role",
            },
          });

        io.to(chatRoomId).emit("receive_message", populated);

      } catch (err) {
        socket.emit("chat_error", { message: "Send failed" });
      }
    });

    /* ================= EDIT MESSAGE ================= */
    socket.on("edit_message", async ({ messageId, content }) => {
      try {
        if (!content || content.trim() === "") {
          return socket.emit("chat_error", {
            message: "Empty message",
          });
        }

        const message = await messageModel.findById(messageId);
        if (!message) return;

        const chatRoom = await chatRoomModel.findById(message.chatRoomId);
        if (!chatRoom) return;

        const workspace = await workspaceModel.findById(chatRoom.workspaceId);
        if (!workspace) return;

        const features = PLANS[workspace.plan]?.features || {};

        // 🔥 PLAN CHECK
        if (!features.editMessage) {
          return socket.emit("chat_error", {
            message: "Edit not allowed in your plan",
          });
        }

        // 🔥 OWNER CHECK
        if (message.senderId.toString() !== socket.userId) {
          return socket.emit("chat_error", {
            message: "Not allowed",
          });
        }

        message.content = content.trim();
        message.isEdited = true;

        await message.save();

        const updated = await messageModel
          .findById(messageId)
          .populate("senderId", "name email role");

        io.to(message.chatRoomId.toString()).emit(
          "message_edited",
          updated
        );

      } catch (err) {
        socket.emit("chat_error", { message: "Edit failed" });
      }
    });

    /* ================= DELETE MESSAGE ================= */
    socket.on("delete_message", async ({ messageId }) => {
      try {
        const message = await messageModel.findById(messageId);
        if (!message) return;

        const chatRoom = await chatRoomModel.findById(message.chatRoomId);
        if (!chatRoom) return;

        const workspace = await workspaceModel.findById(chatRoom.workspaceId);
        if (!workspace) return;

        const features = PLANS[workspace.plan]?.features || {};

        // 🔥 PLAN CHECK
        if (!features.deleteMessage) {
          return socket.emit("chat_error", {
            message: "Delete not allowed in your plan",
          });
        }

        // 🔥 OWNER CHECK
        if (message.senderId.toString() !== socket.userId) return;

        await messageModel.deleteOne({ _id: messageId });

        io.to(message.chatRoomId.toString()).emit(
          "message_deleted",
          { messageId }
        );

      } catch (err) {}
    });

    /* ================= DISCONNECT ================= */
    socket.on("disconnect", () => {});
  });
};