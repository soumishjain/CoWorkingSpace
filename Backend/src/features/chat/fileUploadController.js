import imagekit from "../../config/imagekit.js";
import workspaceModel from "../../models/workspace.models.js";
import workspaceMemberModel from "../../models/workspaceMember.models.js";
import { PLANS } from "../../utils/plans.js";

export const uploadChatFile = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.userId;
    const { workspaceId } = req.body;

    // ================= VALIDATION =================
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (!workspaceId) {
      return res.status(400).json({ success: false, message: "Workspace ID required" });
    }

    // ================= WORKSPACE =================
    const workspace = await workspaceModel.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ success: false, message: "Workspace not found" });
    }

    // ================= MEMBERSHIP =================
    const isMember = await workspaceMemberModel.findOne({
      workspaceId,
      userId,
    });

    if (!isMember) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // ================= PLAN CHECK =================
    const plan = PLANS[workspace.plan];

    if (!plan?.features?.fileUpload) {
      return res.status(403).json({
        success: false,
        message: "File upload not allowed in your plan",
      });
    }

    // ================= SECURITY =================
    const blockedExtensions = ["exe", "bat", "sh"];
    const ext = file.originalname.split(".").pop().toLowerCase();

    if (blockedExtensions.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: "This file type is not allowed",
      });
    }

    // ================= UPLOAD =================
    const uploaded = await imagekit.files.upload({
      file: file.buffer.toString("base64"),
      fileName: `chat-${userId}-${Date.now()}-${file.originalname}`,
      folder: "/coworkingspace/chat",
    });

    // ================= TYPE DETECTION =================
    let type = "file";

    if (file.mimetype.startsWith("image/")) type = "image";
    else if (file.mimetype.startsWith("video/")) type = "video";
    else if (file.mimetype.startsWith("audio/")) type = "audio";

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      fileUrl: uploaded.url,
      type,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

  } catch (error) {
    console.error("💥 Upload error:", error);

    return res.status(500).json({
      success: false,
      message: "File upload failed",
    });
  }
};