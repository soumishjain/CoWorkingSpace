import subtaskModel from "../../models/subtask.models"
import taskModel from "../../models/task.models"

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
    
}

export async function getMyPendingSubtasks(req,res) {

}