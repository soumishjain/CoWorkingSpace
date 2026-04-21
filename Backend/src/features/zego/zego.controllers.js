export const generateZegoToken = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatRoomId } = req.query;

    if (!chatRoomId) {
      return res.status(400).json({
        message: "chatRoomId required"
      });
    }

    // ✅ CHECK ROOM + MEMBERSHIP
    const chatRoom = await chatRoomModel.findOne({
      _id: chatRoomId,
      members: userId
    });

    if (!chatRoom) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    // 🚫 OPTIONAL: block announcement rooms
    if (chatRoom.type === "announcement") {
      return res.status(400).json({
        message: "Video call not allowed in this room"
      });
    }

    // ✅ GET WORKSPACE + PLAN
    const workspace = await workspaceModel
      .findById(chatRoom.workspaceId)
      .populate("plan");

    const features = workspace.plan?.features || {};

    // ✅ PLAN CHECK
    if (!features.videoCall) {
      return res.status(403).json({
        message: "Video call not allowed in your plan"
      });
    }

    // ===== 🔥 TOKEN =====
    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    const token = generateToken04(
      appID,
      userId.toString(), // 🔥 IMPORTANT FIX
      serverSecret,
      3600
    );

    return res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Token generation failed"
    });
  }
};