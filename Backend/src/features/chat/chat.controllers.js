import messageModel from "../../models/message.models.js";
import chatRoomModel from "../../models/chatRoom.models.js";
import workspaceMemberModel from "../../models/workspaceMember.models.js";
import departmentMemberModel from "../../models/departmentMember.models.js";

import mongoose from "mongoose";

export const getMessages = async (req, res) => {
  try {
 
    const { chatRoomId } = req.params;
    let { page = 1, limit = 20 } = req.query;
    const userId = req.userId;

    page = parseInt(page);
    limit = parseInt(limit);

    const roomId = new mongoose.Types.ObjectId(chatRoomId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    /* ================= VALIDATE ACCESS ================= */
    const chatRoom = await chatRoomModel.findOne({
      _id: roomId,
      members: { $in: [userObjectId] }, // 🔥 FIXED
    }).lean();

       console.log("====== ACCESS DEBUG ======");
console.log("chatRoomId:", chatRoomId);
console.log("userId:", userId);

const room = await chatRoomModel.findById(chatRoomId);
console.log("ROOM FOUND:", !!room);
console.log("ROOM MEMBERS:", room?.members);

const isMember = room?.members?.some(
  (id) => id.toString() === userId.toString()
);

console.log("IS USER MEMBER:", isMember);
console.log("==========================");

    if (!chatRoom) {
      return res.status(403).json({
        message: "Access denied or chat room not found",
      });
    }

    /* ================= FETCH MESSAGES ================= */
    const messages = await messageModel
      .find({ chatRoomId: roomId }) // 🔥 FIXED
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "name email")
      .populate("mentions", "name email")
      .populate({
        path: "replyTo",
        populate: {
          path: "senderId",
          select: "name email",
        },
      })
      .lean();

    /* ================= COLLECT USER IDS ================= */
    const userIds = new Set();

    messages.forEach((msg) => {
      if (msg.senderId?._id) {
        userIds.add(msg.senderId._id.toString());
      }

      if (msg.replyTo?.senderId?._id) {
        userIds.add(msg.replyTo.senderId._id.toString());
      }
    });

    const userIdArray = Array.from(userIds).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    /* ================= FETCH ROLES ================= */

    // workspace roles
    const workspaceMembers = await workspaceMemberModel
      .find({
        workspaceId: chatRoom.workspaceId,
        userId: { $in: userIdArray },
      })
      .select("userId role")
      .lean();

    // department roles
    const departmentMembers = await departmentMemberModel
      .find({
        department: chatRoom.departmentId,
        userId: { $in: userIdArray },
      })
      .select("userId role")
      .lean();

    /* ================= BUILD ROLE MAP ================= */
    const roleMap = {};

    // workspace roles
    workspaceMembers.forEach((m) => {
      roleMap[m.userId.toString()] = m.role;
    });

    // department override (manager > member, admin stays top)
    departmentMembers.forEach((m) => {
      const uid = m.userId.toString();

      if (m.role === "manager" && roleMap[uid] !== "admin") {
        roleMap[uid] = "manager";
      }
    });

    /* ================= ATTACH ROLES ================= */
    const enrichedMessages = messages.map((msg) => {
      const senderId = msg.senderId?._id?.toString();

      const enrichedMsg = {
        ...msg,
        senderId: {
          ...msg.senderId,
          role: roleMap[senderId] || "member",
        },
      };

      // reply role fix
      if (msg.replyTo?.senderId?._id) {
        const replySenderId =
          msg.replyTo.senderId._id.toString();

        enrichedMsg.replyTo = {
          ...msg.replyTo,
          senderId: {
            ...msg.replyTo.senderId,
            role: roleMap[replySenderId] || "member",
          },
        };
      }

      return enrichedMsg;
    });

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      message: "Messages fetched successfully",
      data: enrichedMessages,
      meta: {
        page,
        limit,
        hasMore: messages.length === limit,
      },
    });

  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      message: "Server error while fetching messages",
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await messageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    // ✅ ONLY SENDER CAN DELETE
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own messages"
      });
    }

    // ✅ DELETE
    await messageModel.deleteOne({ _id: messageId });

    return res.status(200).json({
      message: "Message deleted successfully"
    });

  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({
      message: "Server error while deleting message"
    });
  }
};

