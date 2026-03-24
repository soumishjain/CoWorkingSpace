import departmentModel from "../../models/department.models.js";
import departmentMemberModel from "../../models/departmentMember.models.js";
import messageModel from "../../models/message.models.js";
import workspaceModel from "../../models/workspace.models.js";
import workspaceMemberModel from "../../models/workspaceMember.models.js";

export async function getOldMessage(req, res) {
  try {
    const userId = req.userId;
    const { departmentId } = req.params;

    if (!departmentId) {
      return res.status(400).json({
        message: "Department ID is required",
      });
    }

    // 🔍 CHECK DEPARTMENT
    const department = await departmentModel.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const workspaceId = department.workspaceId;

    // 🔍 CHECK WORKSPACE
    const workspace = await workspaceModel.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // 🔐 AUTH CHECK
    const admin = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
      role: "admin",
    });

    const departmentMember = await departmentMemberModel.findOne({
      userId,
      departmentId,
    });

    if (!admin && !departmentMember) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // 📥 FETCH MESSAGES + POPULATE
    const messages = await messageModel
      .find({ departmentId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name profileImage");

    // ✅ IMPORTANT: "data" return karo (frontend ke liye)
    return res.status(200).json({
      success: true,
      data: messages,
    });

  } catch (err) {
    console.error("GET OLD MESSAGE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}