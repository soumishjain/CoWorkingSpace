export const planCheckMiddleware = async (req, res, next) => {
  try{
    const workspace = req.workspace;
  const department = req.department;
  

  if (!workspace.plan || !workspace.plan.limits) {
      return res.status(400).json({
        message: "Invalid subscription plan"
      });
    }
    const plan = workspace.plan;  
  const limits = plan.limits;

  const chatRooms = await chatRoomModel.countDocuments({ workspaceId: workspace._id , departmentId : department._id });
    if (chatRooms >= limits.chatroomsPerDepartment) {
        return res.status(403).json({
            message : "Chat room limit reached for this department under the current plan"
        });
    }
    next();
  }catch(error){
    return res.status(500).json({
      message : "Server error while checking plan limits"
    })
  }
};