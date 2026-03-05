import mongoose from "mongoose";
import departmentMemberModel from "../../models/departmentMember.models";
import subtaskModel from "../../models/subtask.models";
import taskModel from "../../models/task.models";
import workspaceMemberModel from "../../models/workspaceMember.models";

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
        const {taskId} = req.params
        const task = await taskModel.findById(taskId)
        if(!task) {
            return res.status(404).json({
                message : "Task not found"
            })
        }
        if(task.status === 'completed') {
            return res.status(400).json({
                message : "Task Completed"
            })
        }
        const userId = req.userId
        const departmentId = task.departmentId
        const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
        if(!departmentManager) {
            return res.status(403).json({
                message : "Not Authorized"
            })
        }

        const session = await mongoose.startSession()

        try{
        await session.withTransaction(async () => {
            await subtaskModel.deleteMany({taskId : task._id} , {session})

            await taskModel.deleteOne({_id : taskId} , {session})
        })
    } finally{
        session.endSession()
    }

        return res.status(200).json({
            message : "Task Deleted Successfully"
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal server Error"
        })
    }
}

export async function getSingleTask(req,res) {
    try{
        const {taskId} = req.params
    const userId = req.userId
    const task = await taskModel.findById(taskId)
    .populate("assignedMembers" , "name email profileImage")
    if(!task){
        return res.status(404).json({
            message : "Task Not found"
        })
    }
    const departmentId = task.departmentId
    const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
    const assignedUser = task.assignedMembers
    .some(mem => mem.toString() === userId)
    if(!departmentManager && !assignedUser) {
        return res.status(403).json({
            message : "Not authorized"
        })
    }


    const subtasks = await subtaskModel.find({taskId})

    return res.status(200).json({
        message : "Task fetched Successfully",
        task,
        subtasks
    })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function getAllTasks(req,res) {
   try{
     const userId = req.userId
    const department = req.department
    const workspace = req.workspace
    const departmentId = department._id
    const workspaceId = workspace._id

    const departmentManager = await departmentMemberModel.findOne({userId , 
        departmentId , role : 'manager'
    })

    const workspaceAdmin = await workspaceMemberModel.findOne({
        userId , 
        workspaceId ,
        role : 'admin'
    })


    let tasks;

    if(departmentManager || workspaceAdmin) {
        tasks = await taskModel.find({departmentId})
        .populate("assignedMembers" , "name email profileImage")
        .sort({createdAt : -1})
    }

    else{
        tasks = await taskModel.find({
            departmentId,
            assignedMembers : { $in : [new mongoose.Types.ObjectId(userId)] }
        }).populate("assignedMembers" , "name email profileImage")
        .sort({createdAt : -1})
    }

    return res.status(200).json({
        message : "Tasks fetched successfully",
        total : tasks.length,
        tasks
    })
   }catch(error){
    console.error(error)
    res.status(500).json({
        message : "Internal server error"
    })
   }
}

export async function approveTask(req,res) {

    try{
        const {taskId} = req.params
    const userId = req.userId

    const task = await taskModel.findById(taskId)

    if(!task){
        return res.status(404).json({
            message : "Task Not Found"
        })
    }

    const departmentId = task.departmentId

    const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})

    if(!departmentManager) {
        return res.status(403).json({
            message : "Not Authorized"
        })
    }

    if(task.status !== 'awaiting-approval') {
        return res.status(400).json({
            message : "Task is not awaiting approval"
        })
    }

    const subtasks = await subtaskModel.find({taskId})

    if(subtasks.length === 0) {
        return res.status(400).json({
            message : "Task has no subtask"
        })
    }

    const incomplete = subtasks.find(s => s.status !== 'completed')

    if(incomplete) {
        return res.status(400).json({
            message : "All subtasks must me completed before approval"
        })
    }

    const session = await mongoose.startSession()

    await session.withTransaction(async () => {

        for(const subtask of subtasks) {
            if(!subtask.completedBy) continue

            const member = await departmentMemberModel.findOne({
                userId : subtask.completedBy,
                departmentId,
            }).session(session)

            if(member) {
                member.currentMonthPoints += subtask.points
                await member.save({session})
            }
        }

        task.status = 'completed'
        task.progress = 100
        task.approvedBy = userId
        task.approvedAt = new Date()

        await task.save({session})
    })

    session.endSession()

    return res.status(200).json({
        message : "task approved successfully"
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

export async function rejectTask(req,res) {
    
    try{
        const {taskId} = req.params
    const {feedback} = req.body
    const userId = req.userId

    const task = await taskModel.findById(taskId)

    if(!task) {
        return res.status(404).json({
            message : "Task not Found"
        })
    }

    const manager = await departmentMemberModel.findOne({
        userId,
        departmentId : task.departmentId,
        role : 'manager'
    })


    if(!manager) {
        return res.status(403).json({
            message : "Not Authorized"
        })
    }

    if(task.status !== 'awaiting-approval') {
        return res.status(400).json({
            message : "Task is not awaiting approval"
        })
    }

    task.status = 'in-progress'
    task.approvalFeedback = feedback || "Task needs improvement"

    await task.save()

    return res.status(200).json({
        message : "Task rejected with feedback"
    })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal server error"
        })
    }

}