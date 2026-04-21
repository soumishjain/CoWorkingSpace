import workspaceModel from "../models/workspace.models.js";

export async function validateWorkspace(req, res, next) {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID is required",
      });
    }

    /* 🔥 IMPORTANT FIX: PLAN POPULATE */
    const workspace = await workspaceModel
      .findById(workspaceId)
      .select("-joinPassword")
      .populate("createdBy", "name email profileImage")
      .populate("plan"); // ✅ THIS WAS MISSING

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    /* 🔥 SAFETY: PLAN EXISTS CHECK */
    if (!workspace.plan) {
      return res.status(500).json({
        message: "Workspace plan not configured",
      });
    }

    /* 🔥 DEBUG (optional, remove later) */
    console.log("✅ WORKSPACE LOADED");
    console.log("👉 plan:", workspace.plan?.id);
    console.log("👉 limits:", workspace.plan?.limits);

    req.workspace = workspace;

    next();
  } catch (error) {
    console.error("❌ validateWorkspace ERROR:", error);

    return res.status(400).json({
      message: "Invalid workspace ID",
    });
  }
}