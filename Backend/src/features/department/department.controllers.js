import mongoose from "mongoose";
import departmentModel from "../../models/department.models";
import departmentMemberModel from "../../models/departmentMember.models";
import workspaceModel from "../../models/workspace.models";
import workspaceMemberModel from "../../models/workspaceMember.models";
import joinRequestModel from "../../models/joinRequest.models";
import taskModel from "../../models/task.models";
import subtaskModel from "../../models/subtask.models";
import monthlyLeaderboardModel from "../../models/monthlyLeaderboard.models";

/** ================ NOT TESTED ================= **/
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

        const departmentManager = await departmentMemberModel.findOne({userId , departmentId , role : 'manager'})
        let workspaceAdmin = null

        if(!departmentManager){
            workspaceAdmin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})
        }

        if(!departmentManager && !workspaceAdmin){
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
        let workspaceAdmin = null

        if(!departmentManager){
            workspaceAdmin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})
        }

        if(!departmentManager && !workspaceAdmin){
            return res.status(403).json({
                message : "Not Authorized"
            })
        }

        const {description} = req.body

        department.description = description
        await department.save()

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

        let admin = null

        if(!user){
            admin = await workspaceMemberModel.findOne({userId , workspaceId , role : 'admin'})
        }

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
            return res.status(500),json({message : "Internal Server Error"})
        }

}


/**

 * getMyDepartments
 * leaveDepartment
 * getAllDepartmentsOfThisWorkspace
 * getAllDepartmentMembers
 * removeMemeberFromDepartment
 * departmentJoinRequest
 * approveDepartmentJoinRequest
 * rejectDepartmentJoinRequest
 * getAllPendingDepartmentRequests
 * departmentStats
 */