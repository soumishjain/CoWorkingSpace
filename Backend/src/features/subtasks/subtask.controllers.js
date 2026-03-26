import { getIO } from "../../lib/socket.js"
import departmentMemberModel from "../../models/departmentMember.models.js"
import subtaskModel from "../../models/subtask.models.js"
import taskModel from "../../models/task.models.js"
import workspaceMemberModel from "../../models/workspaceMember.models.js"
import { createActivity } from "../../utils/createActivity.js"

export async function getSubtasksOfTasks(req,res){
    try{
        const {taskId} = req.params
    const task = await taskModel.findById(taskId)

    if(!task) {
        return res.status(404).json({
            message : "No task found"
        })
    }

    const departmentId = task.departmentId

    const userId = req.userId


const user = await departmentMemberModel.findOne({
  userId,
  departmentId,
});

const isAdmin = await workspaceMemberModel.findOne({
  userId,
  workspaceId: task.workspaceId,
  role: "admin",
});

if (!user && !isAdmin) {
  return res.status(403).json({
    message: "not Authorized",
  });
}

    const subtasks = await subtaskModel.find({taskId})
    .populate("assignedTo" , "name email profileImage")

    res.status(200).json({
        message : "All Subtasks Fetched",
        subtasks
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

export async function claimSubtask(req,res) {
    
    try{
        const {subtaskId} = req.params
    const subtask = await subtaskModel.findById(subtaskId)

    if(!subtask) {
        return res.status(404).json({
            message : "Subtask not found"
        })
    }

        if(subtask.assignedTo){
        return res.status(400).json({
            message : "This Task is already been assigned"
        })
    }

    const userId = req.userId


    const taskId = subtask.taskId

    const task = await taskModel.findById(taskId)

    if(!task){
        return res.status(404).json({
            message : "Task not found"
        })
    }

    const departmentId = task.departmentId
    
    const assignedMembers = task.assignedMembers

    const isUserAssigned = assignedMembers.some(mem => mem.toString() === userId)

    if(!isUserAssigned) {
        return res.status(403).json({
            message : "You are not assigned this task"
        })
    }

    if(subtask.status === 'completed'){
        return res.json(400)
.json({
    message : "Subtask already completed"
})    }

    const alreadyClaimed  = await subtaskModel.findOne({taskId , assignedTo : userId , status : 'pending'})

    if(alreadyClaimed){
        return res.status(403).json({
            message : "Complete old task to claim new task"
        })
    }    

    subtask.assignedTo = userId
    subtask.claimedAt = new Date()

    await subtask.save()

    await createActivity({
        workspaceId : task.workspaceId,
        departmentId,
        userId,
        type : "SUBTASK_CLAIMED",
        message : `claimed subtask ${subtask.title}`
    })

    const io = getIO()

    io.to(departmentId.toString()).emit("subtask-claimed",{
        subtaskId : subtask._id,
        userId,
        taskId
    })

    return res.status(200).json({
        message : "Subtask has been claimed successfully"
    })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }


}

export async function completeSubtask(req, res) {
  try {
    const { subtaskId } = req.params;
    const userId = req.userId;
    const io = getIO();

    const subtask = await subtaskModel.findById(subtaskId);

    if (!subtask) {
      return res.status(404).json({
        message: "Subtask not found",
      });
    }

    if (!subtask.assignedTo || subtask.assignedTo.toString() !== userId) {
      return res.status(403).json({
        message: "You did not claim this subtask",
      });
    }

    if (subtask.status === "completed") {
      return res.status(400).json({
        message: "Subtask already completed",
      });
    }

    const task = await taskModel.findById(subtask.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const taskId = subtask.taskId;

    // ✅ COMPLETE SUBTASK
    subtask.status = "completed";
    subtask.completedAt = new Date();
    subtask.completedBy = userId;

    await subtask.save();

    // 🔥 STEP 1: increment FIRST
    task.completedSubtasks += 1;

    // 🔥 STEP 2: calculate progress (0–90 scale)
    if (task.totalSubtasks > 0) {
      const progress =
        (task.completedSubtasks / task.totalSubtasks) * 90;

      task.progress = Math.floor(progress);
    } else {
      task.progress = 0;
    }

    // 🔥 STEP 3: if all done → awaiting approval
    if (task.completedSubtasks === task.totalSubtasks) {
      task.status = "awaiting-approval";
      task.progress = 90; // cap
    }

    await task.save();

    const departmentId = task.departmentId;

    await createActivity({
      workspaceId: task.workspaceId,
      departmentId,
      userId,
      type: "SUBTASK_COMPLETED",
      message: `completed subtask ${subtask.title}`,
    });

    // 🔥 SOCKET EVENTS
    io.to(departmentId.toString()).emit("subtask-completed", {
      subtaskId: subtask._id,
      userId,
      taskId,
    });

    io.to(departmentId.toString()).emit("task-updated", task);

    return res.status(200).json({
      message: "Subtask completed Successfully",
      task,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getMyPendingSubtasks(req,res) {
    try{
        const userId = req.userId

    const subtasks = await subtaskModel.find({
        assignedTo : userId,
        status : 'pending'
    })
    .populate("taskId" , "title priority deadline")

    return res.status(200).json({
        message : "Pending subtasks fetched",
        total : subtasks.length,
        subtasks
    })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }

}