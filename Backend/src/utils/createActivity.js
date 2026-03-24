import { getIO } from "../lib/socket.js";
import activityModel from "../models/activity.models.js";

export async function createActivity({
  workspaceId,
  departmentId = null,
  userId,
  type,
  message,
}) {
  try {
    const activity = await activityModel.create({
      workspaceId,
      departmentId,
      userId,
      type,
      message,
    });

    const populatedActivity = await activity.populate(
      "userId",
      "name profileImage"
    );

    const io = getIO(); // 🔥 important

    // 🔥 WORKSPACE LEVEL
    io.to(workspaceId.toString()).emit(
      "new-activity",
      populatedActivity
    );

    // 🔥 DEPARTMENT LEVEL
    if (departmentId) {
      io.to(departmentId.toString()).emit(
        "new-department-activity",
        populatedActivity
      );
    }

    return populatedActivity;

  } catch (error) {
    console.error("CREATE ACTIVITY ERROR:", error);
    throw error;
  }
}