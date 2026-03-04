import subtaskModel from "../../models/subtask.models";

export async function createTask(req,res) {

    const userId = req.userId;
    const workspace = req.workspace ;
    const department = req.department;


    const {title , description , priority , deadline , assignedMembers, subtasks} = req.body
    if(!title || !priority || !deadline){
        return res.status(400).json({
            message : "All requiered Fields must be provided"
        })
    }

    if(!assignedMembers || !assignedMembers.length) {
        return res.status(400).json({
            message : "Task must be assigned to at least one member"
        })
    }

    if(!subtasks || !subtasks.length){
        return res.status(400).json({
            message : "At least one subtask is required"
        })
    }

    const priorityPoints = {
        low : 30,
        medium : 60,
        high : 100
    }

    const totalPoints = priorityPoints[priority]

    if(!totalPoints) {
        return res.status(400).json({
            message : "Invalid Priority Value"
        })
    }

    const totalSubtasks = subtasks.length
    const basePoints = Math.floor(totalPoints / totalSubtasks)
    const remainingPoints = totalPoints - (basePoints * totalSubtasks)

    const task = await taskModel.create ({
        title,
        description ,
        createdBy : userId,
        workspaceId : workspace._id,
        departmentId : department._id,
        assignedMembers,
        priority,
        totalPoints,
        totalSubtasks,
        completedSubtasks : 0,
        deadline,
        progress : 0,
        status : "pending",
    })

    const subtaskDocs = subtasks.map((s,index) => ({
        title: s.title,
        description: s.description || "",
        taskId : task._id,
        points : index === totalSubtasks - 1 ? basePoints + remainingPoints : basePoints,
        deadline : s.deadline || deadline
    }))

    await subtaskModel.insertMany(subtaskDocs)

    return res.status(201).json({
        message : "Task Created Successfully",
        task
    })
}

export async function deleteTask(req,res) {
    try{

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal server Error"
        })
    }
}

/**
 * updateTask
 * deleteTask
 * getAllTasksOfDepartment
 * getSingleTask
 * approveTask
 */