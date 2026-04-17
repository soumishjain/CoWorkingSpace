import messageModel from "../../models/message.models.js";
import chatRoomModel from "../../models/chatRoom.models.js";

export const getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    let { page = 1, limit = 20 } = req.query;
    const userId = req.userId;

    page = parseInt(page);
    limit = parseInt(limit);

    const chatRoom = await chatRoomModel.findOne({
      _id: chatRoomId,
      members: userId,
    });

    if (!chatRoom) {
      return res.status(403).json({
        message: "Access denied or chat room not found",
      });
    }

    // 🔥 KEEP DESC ORDER (NO REVERSE)
    const messages = await messageModel
      .find({ chatRoomId })
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "name email role") // 🔥 role bhi bhej
      .populate("mentions", "name email")
      .populate({
        path: "replyTo",
        populate: {
          path: "senderId",
          select: "name email",
        },
      });

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages, // ❌ reverse hata diya
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

