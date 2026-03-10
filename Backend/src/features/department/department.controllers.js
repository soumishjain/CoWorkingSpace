import mongoose from "mongoose";
import departmentModel from "../../models/department.models.js";
import departmentMemberModel from "../../models/departmentMember.models.js";
import workspaceModel from "../../models/workspace.models.js";
import workspaceMemberModel from "../../models/workspaceMember.models.js";
import joinRequestModel from "../../models/joinRequest.models.js";
import taskModel from "../../models/task.models.js";
import subtaskModel from "../../models/subtask.models.js";
import monthlyLeaderboardModel from "../../models/monthlyLeaderboard.models.js";
import { createActivity } from "../../utils/createActivity.js";
import { createNotification } from "../../utils/createNotification.js";

export async function createDepartment(req,res){
    try{

        const workspace = req.workspace
    const userId = req.userId

    const admin = await workspaceMemberModel.findOne({userId , workspaceId : workspace._id})

    if(!admin || admin.role !== 'admin') {
        return res.status(403).json({
            message : "You are not authorized to create a department in this workspace"
        })
    }

    const {name , description} = req.body
    const department = await departmentModel.create({
        name : name , 
        description : description,
        workspaceId : workspace._id ,
        createdBy : userId 
    })

    res.status(200).json({
        message : "Department created Successfully",
        department : department 
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

export async function addDepartmentManager(req,res){

    try{
        const {assignedUserId} = req.params
    const adminId = req.userId
    const workspace = req.workspace
    const department = req.department

    const admin = await workspaceMemberModel.findOne({
        userId : adminId , 
        workspaceId : workspace._id
    })

    if(!admin || admin.role !== 'admin'){
        return res.status(403).json({
            message : "Not authorized"
        })
    }

    const assignedUser = await workspaceMemberModel.findOne({
        userId : assignedUserId,
        workspaceId : workspace._id
    })

    if(!assignedUser) {
        return res.status(404).json({
            message : "User is not the part of workspace"
        })
    }

      if(assignedUser.role === 'admin'){
        return res.status(400).json({
            message : "Workspace admin cannot be assigned as department manager"
        })
    }


    const isManagerExist = await departmentMemberModel.findOne({
        departmentId : department._id , role : 'manager'
    })

    if(isManagerExist && isManagerExist.userId.toString() === assignedUserId){
        return res.status(403).json({
            message : "User is already a manager"
        })
    }

    if(isManagerExist){
       isManagerExist.role = 'employee'
       await isManagerExist.save()
    }

    const existingMember = await departmentMemberModel.findOne({
        userId : assignedUserId,
        departmentId : department._id
    })

    let manager;

    if(existingMember){
        existingMember.role = 'manager';
        manager = await existingMember.save()
    }
    else{
    manager = await departmentMemberModel.create({
       userId : assignedUserId ,
        departmentId : department._id ,
         role : 'manager'
    })
}

await createActivity({
    workspaceId : department.workspaceId,
    departmentId : department._id,
    userId : adminId,
    type : "MANAGER_ASSIGNED",
    message : `${assignedUser.name} was assigned as department manager`
})

io.to(department._id.toString())
.emit('manager-assigned',{
    departmentId : department._id,
    managerId : assignedUserId
})

await createNotification({
    workspaceId : department.workspaceId,
    departmentId : department._id,
    userId : assignedUserId,
    type : "MANAGER_ASSIGNED",
    message : "Congratulations! you have been assigned as department manager"
})

io.to(assignedUser._id.toString()).emit("manager-assigned",{
    departmentId : department._id,
    type : "MANAGER_ASSIGNED"
})



    res.status(201).json({
        message : "Manager Assigned Successfully",
        manager
    })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

export async function addMemberInDepartment(req,res){
    
    try{
        const {newUserId} = req.params
    const headId = req.userId

    const workspace = req.workspace
    const department = req.department

    const newUser = await workspaceMemberModel.findOne({userId : newUserId , workspaceId : workspace._id})

    if(!newUser){
        return res.status(404).json({
            message : "User is not a member of workspace"
        })
    }

    if(newUser.role === "admin"){
        return res.status(400).json({
            message : "You cannot add admin in department"
        })
    }

   const workspaceAdmin = await workspaceMemberModel.findOne({workspaceId : workspace._id , userId : headId , role : "admin"})
   const departmentManager = await departmentMemberModel.findOne({departmentId : department._id , userId : headId , role : 'manager'})

   if(!workspaceAdmin && !departmentManager){
    return res.status(403).json({
        message : "Not authorized"
    })
   }

   const existingMember = await departmentMemberModel.findOne({departmentId : department._id , userId : newUserId})

   if(existingMember){
    return res.status(400).json({
        message : "User is already a member of this department"
    })
   }

    const newMember = await departmentMemberModel.create({
        userId : newUserId,
        departmentId : department._id ,
        role : "employee"
    })


    await createActivity({
        workspaceId : workspace._id,
        departmentId : department._id,
        userId : headId,
        type : "MEMBER_ADDED",
        message : `added a member to department`
    })

    io.to(department._id.toString()).emit("member-added",{
        departmentId : department._id,
        userId : newUserId
    })

    await createNotification({
        workspaceId : workspace._id,
        departmentId : department._id,
        userId : newUserId,
        type : "MEMBER_ADDED",
        message : `you have been added in the department`
    })

    io.to(newUserId.toString()).emoit("member-added",{
        departmentId : department._id,
        type : "MEMBER_ADDED"
    })



    return res.status(201).json({
        message : "user added successfully",
        newMember
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

//* deleteDepartment
export async function deleteDepartment(req,res) {
    try{
        const userId = req.userId
        const workspace = req.workspace
        const department = req.department
        const departmentId = department._id
        const workspaceId = workspace._id

        
        const workspaceAdmin = await workspaceMemberModel.findOne({workspaceId,userId,role : 'admin'})

        if(!workspaceAdmin) {
            return res.status(403).json({
                message : "Not Authorized"
            })
        }
       

        const session = await mongoose.startSession()

        await session.withTransaction(async () => {

      await departmentModel.deleteOne(
        { _id: departmentId },
        { session }
      );

      await departmentMemberModel.deleteMany(
        { departmentId },
        { session }
      );

      await joinRequestModel.deleteMany(
        { departmentId },
        { session }
      );

      await taskModel.deleteMany(
        { departmentId },
        { session }
      );

      await subtaskModel.deleteMany(
        { departmentId },
        { session }
      );

    });

    session.endSession();

    return res.status(200).json({
      message: "Department Deleted Successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

// * updateDepartment
export async function updateDepartment(req,res) {
        try{
        const userId = req.userId
        const workspace = req.workspace
        const department = req.department
        const departmentId = department._id
        const workspaceId = workspace._id

        const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})

        const workspaceAdmin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})

  

        if(!departmentManager && !workspaceAdmin){
            return res.status(403).json({
                message : "Not Authorized"
            })
        }

        const {description} = req.body

        department.description = description
        await department.save()

        await createActivity({
        workspaceId : workspace._id,
        departmentId : department._id,
        userId : headId,
        type : "DEPARTMENT_UPDATED",
        message : `department updated`
    })

    io.to(department._id.toString()).emit("department-updated",{
        departmentId : department._id,
    })

        return res.status(200).json({
            message : "Department Updated Successfully",
            department
        })
        }catch(error){
            res.status(500).json({message : "Internal Server Error"})
        }
}

// * getThisDepartment
export async function getThisDepartment(req,res) {
        try{
        const userId = req.userId
        const workspace = req.workspace
        const department = req.department
        const departmentId = department._id
        const workspaceId = workspace._id

        const user = await departmentMemberModel.findOne({userId , departmentId})

        const admin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})


        if(!user && !admin){
            return res.status(403).json({
                message : "Not Authorized"
            })
        }

        const [members , manager , leaderboard] = await Promise.all([
            departmentMemberModel.find({departmentId})
            .populate("userId" , "name email profileImage"),


            departmentMemberModel.findOne({departmentId , role : 'manager'})
            .populate("userId" , "name email profileImage"),

            monthlyLeaderboardModel.find({departmentId})
            .sort({month : -1})
            .limit(1)
        ])

        res.status(200).json({
            message : "Department Details Fetched Successfully",
            totalMembers : members.length,
            manager,
            leaderboard,
            members,
            department
        })
        }catch(error){
            console.error(error)
            return res.status(500).json({message : "Internal Server Error"})
        }

}

// * getMyDepartments
export async function getMyDepartments(req,res) {
    try{
        const userId = req.userId
    const workspace = req.workspace
    const workspaceId = workspace._id

    const isUserInWorkspace = await workspaceMemberModel.findOne({workspaceId , userId})

    if(!isUserInWorkspace){
        return res.status(403).json({
            message : "User not in workspace"
        })
    }

    const myDepartments = await departmentMemberModel.find({userId})
    .populate({
        path : "departmentId",
        match: {workspaceId},
        select : "name description createdBy"
    })

    const filtered = myDepartments.filter(d => d.departmentId !== null)

    res.status(200).json({
        message : "All Departments fetched successfully",
        filtered
    })

    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

// *leaveDepartment
export async function leaveDepartment(req,res){
    try{
        const workspace = req.workspace
    const userId = req.userId
    const department = req.department

    const departmentId = department._id
    const workspaceId = workspace._id

    let user = await workspaceMemberModel.findOne({userId , workspaceId})

    if(!user){
        return res.status(404).json({
            message : "You are not the part of this workspace"
        })
    }

    user = await departmentMemberModel.findOne({departmentId , userId})


    if(!user){
        return res.status(404).json({
            message : "You are not the part of this department"
        })
    }
    const manager = await departmentMemberModel.findOne({departmentId,role : 'manager'})

    await departmentMemberModel.findOneAndDelete({userId , departmentId})

    await createActivity({
        workspaceId : workspace._id,
        departmentId : department._id,
        userId : headId,
        type : "MEMBER-LEFT",
        message : `${user.name} left the department`
    })

    io.to(department._id.toString()).emit("member-left",{
        departmentId : department._id,
        userId
    })

    await createNotification({
        workspaceId : workspace._id,
        departmentId : department._id,
        userId : manager._id,
        type : "MEMBER-LEFT",
        message : `${user.name} left the department`
    })

    io.to(manager._id.toString()).emit("member-left",{
        departmentId : department._id
    })


    res.status(200).json({
        message : "You are no longer part of this department",
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function getAllDepartmentsOfThisWorkspace(req,res){
    try{
        const userId = req.userId
    const workspace = req.workspace
    const workspaceId = workspace._id

    const user = await workspaceMemberModel.findOne({userId , workspaceId})

    if(!user){
        return res.status(403).json({
            message : "You are not a member of this workspace"
        })
    }

    const departments = await departmentModel.find({workspaceId})

    return res.status(200).json({
        message : "All departments of this workspace fetched",
        departments
    })

    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

// * getAllDepartmentMembers
export async function getAllDepartmentMembers(req,res){
    try{
        const userId = req.userId
    const workspace = req.workspace
    const department = req.department
    const departmentId = department._id
    const workspaceId = workspace._id

    const workspaceMember = await workspaceMemberModel.findOne({userId , workspaceId})

    if(!workspaceMember){
        return res.status(403).json({
            message : "You are not the member of this workspace"
        })
    }

    const departmentMember = await departmentMemberModel.findOne({userId , departmentId})

    if(!departmentMember && workspaceMember.role !== 'admin') {
        return res.status(403).json({
            message : "You are not a member of this department"
        })
    }

    const departmentMembers = await departmentMemberModel.find({departmentId}).populate("userId" , "name email profileImage")

    res.status(200).json({
        message : "All department Members fetched successfully",
        total : departmentMembers.length,
        departmentMembers
    })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }

    

}

// * removeMemeberFromDepartment
export async function removeMemberFromDepartment(req,res) {
    try{
        const headId = req.userId
    const workspace = req.workspace
    const department = req.department
    const departmentId = department._id
    const workspaceId = workspace._id


    const {removeUserId} = req.params

    const headAdmin = await workspaceMemberModel.findOne({workspaceId , userId : headId , role: "admin"})

    const headManager = await departmentMemberModel.findOne({userId : headId , departmentId , role : 'manager'})

    if(!headAdmin && !headManager) {
        return res.status(403).json({
            message : "Unauthorized Access"
        })
    }

    const removeUser = await departmentMemberModel.findOne({userId : removeUserId , departmentId})

    if(!removeUser){
        return res.status(404).json({
            message : "User is not a member of department"
        })
    }

    if(removeUserId == headId) {
        return res.status(400).json({
            message : "Use Leave Workspace Instead"
        })
    }

    await departmentMemberModel.findOneAndDelete({userId : removeUserId , departmentId})


    await createActivity({
        workspaceId : workspace._id,
        departmentId : department._id,
        userId : headId,
        type : "MEMBER_REMOVED",
        message : `removed a member from department`
    })

    io.to(department._id.toString()).emit("member-removed",{
        departmentId : department._id,
        userId : removeUserId
    })

    await createNotification({
        workspaceId : workspace._id,
        departmentId : department._id,
        userId : removeUserId,
        type : "MEMBER-REMOVED",
        message : `You have been removed from the department`
    })

    io.to(removeUserId.toString()).emit("member-removed",{
        departmentId : department._id
    })




    return res.status(200).json({
        message : "User removed Successfully"
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

    

}

export async function joinDepartment(req,res){
    try{
        const workspace = req.workspace
    const department = req.department
    const userId = req.userId
    const departmentId = department._id
    const workspaceId = workspace._id

    const user = await workspaceMemberModel.findOne({userId , workspaceId})

    if(!user){
        return res.status(403).json({
            message : "You are not a member of this Workspace"
        })
    }

    if(user.role === 'admin'){
        return res.status(403).json({
            message : "Admin cannot join any department"
        })
    }

    const departmentMember = await departmentMemberModel.findOne({userId , departmentId})

    if(departmentMember) {
        return res.status(400).json({
            message : "You are already a member of this department"
        })
    }

    const requested = await joinRequestModel.findOne({userId , departmentId , type : 'department' , status : 'pending'})

    if(requested) {
        return res.status(400).json({
            message : "You have already sent a request to this department"
        })
    }

    const request = await joinRequestModel.create({
        userId , 
        departmentId , 
        type : 'department',
        status : 'pending'
    })

    const manager = departmentMember.model.find({departmentId , role : 'manager'})

    await createNotification({
        workspaceId : workspaceId,
        departmentId : departmentId,
        userId : manager._id,
        type : "JOIN_REQUEST",
        message : `${user.name} requested to join the department ${department.name}`
    })

    io.to(manager._id.toString()).emit('join-request',{
        department : departmentId
    })

    res.status(201).json({
        message : "Request sent successfully",
        request
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

export async function approveDepartmentJoinRequest (req,res) {
    try{
    const userId = req.userId
    const workspace = req.workspace
    const department = req.department
    const workspaceId = workspace._id
    const departmentId = department._id
    const {reqId} = req.params

    const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
    const workspaceAdmin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})
    if(!departmentManager && !workspaceAdmin) {
            return res.status(403).json({
                message : "You are not authorized"
            })
    }

    const request = await joinRequestModel.findOne({_id : reqId , status: 'pending' , type : 'department'})

    if(!request){
        return res.status(404).json({
            message : "No request found"
        })
    }

    const alreadyMember = await departmentMemberModel.findOne({
        userId : request.userId,
        departmentId
    })

    if(alreadyMember) {
        return res.status(400).json({
            message : "User already a member"
        })
    }


    const newUser = await departmentMemberModel.create({userId : request.userId , departmentId , role : 'employee'})


    await joinRequestModel.findByIdAndDelete(reqId)

    await createNotification({
    workspaceId : workspace._id,
    departmentId : department._id,
    userId : request.userId,
    type : "JOIN_REQUEST_APPROVED",
    message : `Your request to join ${department.name} was approved`
})

io.to(request.userId.toString()).emit("join-request-approved",{
    departmentId : department._id
})

    res.status(200).json({
        message : "Join request approved",
        newUser
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }


} 

export async function rejectDepartmentJoinRequest(req,res){
    try{
    const userId = req.userId
    const workspace = req.workspace
    const department = req.department
    const workspaceId = workspace._id
    const departmentId = department._id
    const {reqId} = req.params

     const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
    const workspaceAdmin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})
    if(!departmentManager && !workspaceAdmin) {
            return res.status(403).json({
                message : "You are not authorized"
            })
    }
    const request = await joinRequestModel.findOne({_id : reqId , departmentId , status: 'pending' , type : 'department'})

    if(!request){
        return res.status(404).json({
            message : "No request found"
        })
    }

    await joinRequestModel.findByIdAndDelete(reqId)

   

    await createNotification({
    workspaceId : workspace._id,
    departmentId : department._id,
    userId : request.userId,
    type : "JOIN_REQUEST_REJECTED",
    message : `Your request to join ${department.name} was rejected`
})

io.to(request.userId.toString()).emit("join-request-rejected",{
    departmentId : department._id
})


    res.status(200).json({
        message : "Join request rejected"
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function getAllPendingDepartmentRequests(req,res) {
    const userId = req.userId
    const workspace = req.workspace
    const department = req.department
    const workspaceId = workspace._id
    const departmentId = department._id

    const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
    const workspaceAdmin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})

    if(!departmentManager && ! workspaceAdmin) {
        return res.status(403).json({
            message : "Not Authorized"
        })
    }

    const requests = await joinRequestModel.find({departmentId , type: 'department' , status : 'pending'}).populate("userId" , "name email profileImage")

    res.status(200).json({
        message : "All Department Pending Requests Fetched Successfully",
        total : requests.length,
        requests
    })

}

export async function departmentStats(req,res) {
     try{
        const userId = req.userId
    const workspace = req.workspace
    const department = req.department
    const workspaceId = workspace._id
    const departmentId = department._id

    const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
    const workspaceAdmin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})

    if(!departmentManager && ! workspaceAdmin) {
        return res.status(403).json({
            message : "Not Authorized"
        })
    }
  const manager = await departmentMemberModel.findOne({departmentId , role : 'manager'})
  .populate("userId" , "name email profileImage")

    const totalEmployees = await departmentMemberModel.countDocuments({departmentId , role : 'employee'})
    const totalMembers = await departmentMemberModel.countDocuments({departmentId})

    const requests = await joinRequestModel.countDocuments({departmentId , status : "pending" , type : 'department'})

    const leaderboard = await departmentMemberModel.find({departmentId , role : 'employee'})
    .sort({currentMonthPoints : -1})
    .limit(3)
    .populate("userId" , "name email profileImage")

    res.status(200).json({
        message : "Department Stats fetched Successfully",
        totalMembers,
        totalEmployees,
        manager ,
        requests,
        leaderboard
    })
     } catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
     }

}