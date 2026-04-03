import messageModel from "../../models/message.models.js";
import chatRoomModel from "../../models/chatRoom.models.js";

export const getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const userId = req.userId;

    const chatRoom = await chatRoomModel.findById(chatRoomId);

    if (!chatRoom) {
      return res.status(404).json({
        message: "Chat room not found"
      });
    }

    const isMember = chatRoom.members.some(
      m => m.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const messages = await messageModel.find({ chatRoomId })
  .sort({ createdAt: 1 })
  .populate("senderId", "name email")
  .populate("mentions", "name email")
  .populate({
    path: "replyTo",
    populate: {
      path: "senderId",
      select: "name email"
    }
  });

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages
    });

  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({
      message: "Server error while fetching messages"
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

    // only sender can delete
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own messages"
      });
    }

    await messageModel.findByIdAndDelete(messageId);

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