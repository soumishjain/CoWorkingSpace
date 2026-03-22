import activityModel from "../models/activity.models.js";
import { io } from "../../server.js";

export async function createActivity({
  workspaceId,
  departmentId = null,
  userId,
  type,
  message,
}) {
  try {
    // 🔥 1. CREATE ACTIVITY
    const activity = await activityModel.create({
      workspaceId,
      departmentId,
      userId,
      type,
      message,
    });

    // 🔥 2. POPULATE USER (frontend ke liye useful)
    const populatedActivity = await activity.populate(
      "userId",
      "name profileImage"
    );

    // 🔥 3. EMIT WORKSPACE LEVEL (GLOBAL FEED)
    io.to(workspaceId.toString()).emit("new-activity", populatedActivity);

    // 🔥 4. EMIT DEPARTMENT LEVEL (OPTIONAL)
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