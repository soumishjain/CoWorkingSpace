import jwt from "jsonwebtoken";
import chatRoomModel from "../models/chatRoom.models.js";
import messageModel from "../models/message.models.js";
import workspaceModel from "../models/workspace.models.js";
import { PLANS } from "../utils/plans.js";
import mongoose from "mongoose";
import workspaceMemberModel from "../models/workspaceMember.models.js";
import { createNotification } from "../utils/createNotification.js";

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

    const roomId = new mongoose.Types.ObjectId(chatRoomId);
    const userId = new mongoose.Types.ObjectId(socket.userId);

    /* ===== VALIDATE ROOM ===== */
    const chatRoom = await chatRoomModel.findOne({
      _id: roomId,
      members: { $in: [userId] },
    });

    if (!chatRoom) return;

    const workspace = await workspaceModel.findById(chatRoom.workspaceId);
    if (!workspace) return;

    const features = PLANS[workspace.plan]?.features || {};

    /* ===== VALIDATION ===== */
    if (type === "text" && !content?.trim()) return;
    if (type !== "text" && !content) return;

    if (type !== "text" && !features.fileUpload) {
      return socket.emit("chat_error", { message: "File not allowed" });
    }

    if (replyTo && !features.replyMessage) {
      return socket.emit("chat_error", { message: "Reply not allowed" });
    }

    if (mentions?.length && !features.mentions) {
      return socket.emit("chat_error", { message: "Mentions not allowed" });
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
      senderId: userId,
      chatRoomId: roomId,
      type,
      fileName,
      replyTo: replyMessage?._id || null,
      mentions: mentions || [],
    });

    /* ===== POPULATE ===== */
    const populated = await messageModel
      .findById(message._id)
      .populate("senderId", "name email")
      .populate({
        path: "replyTo",
        populate: {
          path: "senderId",
          select: "name email",
        },
      });

    /* ===== ATTACH ROLE (TEMP FIX) ===== */
    const member = await workspaceMemberModel.findOne({
      workspaceId: chatRoom.workspaceId,
      userId: userId,
    }).lean();

    if (member) {
      populated.senderId.role = member.role;
    }

    io.to(chatRoomId).emit("receive_message", populated);

  } catch (err) {
    console.error("SOCKET SEND ERROR:", err);
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

    /* ================= INITIATE VIDEO CALL ================= */
    socket.on("initiate_video_call", async (data) => {
      try {
        const { chatRoomId, chatRoomName } = data;
        const userId = new mongoose.Types.ObjectId(socket.userId);
        const roomId = new mongoose.Types.ObjectId(chatRoomId);

        console.log("SOCKET : ", chatRoomId,chatRoomName)

        /* ===== VALIDATE ROOM ===== */
        const chatRoom = await chatRoomModel.findOne({
          _id: roomId,
          members: { $in: [userId] },
        }).populate("members", "name email");

        if (!chatRoom) return;

        /* ===== GET CALLER INFO ===== */
        const caller = chatRoom.members.find(
          (m) => m._id.toString() === socket.userId
        );

        if (!caller) return;

        /* ===== SEND REAL-TIME NOTIFICATION ===== */
        socket.broadcast.to(chatRoomId).emit("video_call_initiated", {
          chatRoomId: chatRoom._id,
          chatRoomName: chatRoomName,
          callerName: caller.name,
          callUrl: `/video/${chatRoomId}`,
          initiatedAt: new Date(),
        });

        /* ===== CREATE DATABASE NOTIFICATIONS FOR OFFLINE MEMBERS ===== */
        const otherMembers = chatRoom.members.filter(
          (m) => m._id.toString() !== socket.userId
        );

        for (const member of otherMembers) {
          await createNotification({
            userId: member._id,
            workspaceId: chatRoom.workspaceId,
            departmentId: chatRoom.departmentId,
            type: "VIDEO_CALL_INITIATED",
            message: `${caller.name} initiated a video call in #${chatRoomName}`,
          });
        }

      } catch (err) {
        console.error("VIDEO CALL ERROR:", err);
        socket.emit("chat_error", { message: "Video call notification failed" });
      }
    });

    /* ================= DISCONNECT ================= */
    socket.on("disconnect", () => {});
  });
};