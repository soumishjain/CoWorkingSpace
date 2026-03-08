import departmentMemberModel from "../../models/departmentMember.models.js"
import subtaskModel from "../../models/subtask.models.js"
import taskModel from "../../models/task.models.js"

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

    const user = await departmentMemberModel.findOne({userId , departmentId})

    if(!user) {
        return res.status(403).json({
            message : "not Authorized"
        })
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

export async function completeSubtask(req,res) {
    try{
        const {subtaskId} = req.params
    const userId = req.userId

    const subtask = await subtaskModel.findById(subtaskId)

    if(!subtask){
        return res.status(404).json({
            message : "Subtask not found"
        })
    }

    if(!subtask.assignedTo || subtask.assignedTo?.toString() !== userId){
        return res.status(403).json({
            message : "You did not claim this subtask"
        })
    }

    if(subtask.status === 'completed') {
        return res.status(400).json({
            message : "Subtask already completed"
        })
    }

    const task = await taskModel.findById(subtask.taskId)
    if(!task){
        return res.status(404).json({
            message : "Task not found"
        })
    }

    subtask.status = 'completed'
    subtask.completedAt = new Date()
    subtask.completedBy = userId

    await subtask.save()

    const progress = (task.completedSubtasks / task.totalSubtasks ) * 90;

    task.progress = Math.floor(progress)
    task.completedSubtasks += 1;

    if(task.completedSubtasks === task.totalSubtasks){
        task.status = 'awaiting-approval'
        task.progress = 90
    }

    await task.save()

    return res.status(200).json({
        message : "Subtask completed Successfully"
    })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
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