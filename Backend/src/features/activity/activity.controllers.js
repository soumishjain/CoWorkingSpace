import activityModel from "../../models/activity.models.js"
import departmentMemberModel from "../../models/departmentMember.models.js"
import workspaceMemberModel from "../../models/workspaceMember.models.js"

export async function getWorkspaceActivities(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const workspace = req.workspace;
    const userId = req.userId;

    const workspaceId = workspace._id;

    // 🔥 check membership
    const member = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
    });

    if (!member) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const limitNum = parseInt(limit);
    const skip = (page - 1) * limitNum;

    const activities = await activityModel
      .find({ workspaceId }) // 🔥 ALL workspace activity
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      activities,
      hasMore: activities.length === limitNum,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
}

export async function getDepartmentActivities(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    const workspaceId = workspace._id;
    const departmentId = department._id;

    // 🔥 check access
    const member = await departmentMemberModel.findOne({
      userId,
      departmentId,
    });

    const admin = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
      role: "admin",
    });

    if (!member && !admin) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const limitNum = parseInt(limit);
    const skip = (page - 1) * limitNum;

    const activities = await activityModel
      .find({ workspaceId, departmentId }) // 🔥 FILTERED
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      activities,
      hasMore: activities.length === limitNum,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
}