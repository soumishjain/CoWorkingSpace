import departmentModel from "../../models/department.models.js";
import departmentMemberModel from "../../models/departmentMember.models.js";
import messageModel from "../../models/message.models.js";
import workspaceModel from "../../models/workspace.models.js";
import workspaceMemberModel from "../../models/workspaceMember.models.js";

export async function getOldMessage(req, res) {
  try {
    const userId = req.userId;
    const { departmentId } = req.params;

    // 🔥 pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

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

    // 🔥 FETCH WITH PAGINATION
    const messages = await messageModel
      .find({ departmentId })
      .sort({ createdAt: -1 }) // 🔥 newest first
      .skip((page - 1) * limit) // 🔥 pagination
      .limit(limit)
      .populate("senderId", "name profileImage");

    // 🔥 collect userIds
    const userIds = messages.map((msg) =>
      msg.senderId._id.toString()
    );

    // 🔥 batch fetch roles
    const workspaceAdmins = await workspaceMemberModel.find({
      workspaceId,
      role: "admin",
      userId: { $in: userIds },
    });

    const departmentMembers = await departmentMemberModel.find({
      departmentId,
      userId: { $in: userIds },
    });

    // 🔥 maps
    const adminSet = new Set(
      workspaceAdmins.map((a) => a.userId.toString())
    );

    const memberMap = new Map();
    departmentMembers.forEach((m) => {
      memberMap.set(m.userId.toString(), m.role);
    });

    // 🔥 attach roles
    const messagesWithRole = messages.map((msg) => {
      const uid = msg.senderId._id.toString();

      let role = "member";

      if (adminSet.has(uid)) {
        role = "admin";
      } else if (memberMap.get(uid) === "manager") {
        role = "manager";
      }

      return {
        ...msg.toObject(),
        role,
      };
    });

    // 🔥 IMPORTANT: reverse before sending
    // frontend ko ascending chahiye for chat UI
    messagesWithRole.reverse();

    return res.status(200).json({
      success: true,
      data: messagesWithRole,
      hasMore: messages.length === limit, // 🔥 pagination helper
    });

  } catch (err) {
    console.error("GET OLD MESSAGE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}