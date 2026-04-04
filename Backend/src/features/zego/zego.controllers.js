import chatRoomModel from "../../models/chatRoom.models.js";
import workspaceModel from "../../models/workspace.models.js";
import { PLANS } from "../../utils/plans.js";
import { generateToken04 } from "../../utils/zegoToken.js";

export const generateZegoToken = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatRoomId } = req.query;

    if (!chatRoomId) {
      return res.status(400).json({
        message: "chatRoomId required"
      });
    }

    // 🔥 get chatroom + workspace
    const chatRoom = await chatRoomModel.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({
        message: "Chatroom not found"
      });
    }

    const workspace = await workspaceModel.findById(chatRoom.workspaceId);

    // 🔥 GET PLAN
    const plan = PLANS[workspace.plan];

    // ===== 🔥 MAIN CHECK =====
    if (!plan.features.videoCall) {
      return res.status(403).json({
        message: "Video call not allowed in your plan"
      });
    }

    // ===== TOKEN GENERATE =====
    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    const token = generateToken04(
      appID,
      userId,
      serverSecret,
      3600
    );

    return res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Token generation failed"
    });
  }
};