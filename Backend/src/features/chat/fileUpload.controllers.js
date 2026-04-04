import ImageKit from "imagekit";
import workspaceModel from "../../models/workspace.models.js";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

export const uploadChatFile = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.userId;
    const { workspaceId } = req.body;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID required"
      });
    }

    // 🔥 FETCH WORKSPACE + PLAN
    const workspace = await workspaceModel.findById(workspaceId).populate("plan");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    const features = workspace.plan.features;

    // 🔥 PLAN CHECK
    if (!features.fileUpload) {
      return res.status(403).json({
        message: "File upload not allowed in your plan"
      });
    }

    // ===== FILE UPLOAD =====
    const uploaded = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `chat-${userId}-${Date.now()}`,
      folder: "/coworkingspace/chat"
    });

    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: uploaded.url
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "File upload failed"
    });
  }
};