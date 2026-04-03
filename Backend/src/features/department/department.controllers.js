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
import { getIO } from "../../lib/socket.js";
import subscriptionModel from "../../models/subscription.models.js";
import { PLANS } from "../../utils/plans.js";

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
    const workspaceId = workspace._id

    const plan = await subscriptionModel.findOne({workspaceId , status : 'active'})

    if(!plan) {
      return res.status(403).json({
        message : "No active Subscription"
      })
    }

    if(workspace.departmentCount >= PLANS[plan].limits.departments) {
      return res.status(403).json({
        message : "Max Departments Count Reached For this Plan"
      })
    }

    const {name , description} = req.body
    const department = await departmentModel.create({
        name : name , 
        description : description,
        workspaceId : workspace._id ,
        createdBy : userId 
    })

    await workspaceModel.findByIdAndUpdate(workspaceId, {
      $inc: { departmentCount: 1 }
    });

    

    await createActivity({
  workspaceId,
  departmentId: department._id,
  userId,
  type: "DEPARTMENT_CREATED",
  message: `${name} department created`
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

export async function addDepartmentManager(req, res) {
  try {
    const { assignedUserId } = req.params;
    const adminId = req.userId;
    const workspace = req.workspace;
    const department = req.department;

    const workspaceId = workspace._id;
    const departmentId = department._id;

    // 🔥 1. BLOCK GENERAL DEPARTMENT (name-based, case-insensitive)
    if ((department.name || "").trim().toLowerCase() === "general") {
      return res.status(400).json({
        message: "General department cannot have a manager",
      });
    }

    // 🔥 2. CHECK ADMIN
    const admin = await workspaceMemberModel.findOne({
      userId: adminId,
      workspaceId,
    });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // 🔥 3. CHECK USER EXISTS IN WORKSPACE + get name
    const assignedUser = await workspaceMemberModel
      .findOne({
        userId: assignedUserId,
        workspaceId,
      })
      .populate("userId", "name");

    if (!assignedUser) {
      return res.status(404).json({
        message: "User is not part of workspace",
      });
    }

    // ❌ WORKSPACE ADMIN cannot be department manager
    if (assignedUser.role === "admin") {
      return res.status(400).json({
        message: "Workspace admin cannot be assigned as department manager",
      });
    }

    // ❌ optional: block self-assign (remove if you want to allow)
    // if (adminId.toString() === assignedUserId.toString()) {
    //   return res.status(400).json({
    //     message: "You cannot assign yourself as manager",
    //   });
    // }

    // 🔥 4. CHECK EXISTING MANAGER
    const existingManager = await departmentMemberModel.findOne({
      departmentId,
      role: "manager",
    });

    if (
      existingManager &&
      existingManager.userId.toString() === assignedUserId
    ) {
      return res.status(400).json({
        message: "User is already the manager",
      });
    }

    // 🔥 5. DEMOTE OLD MANAGER (if any)
    if (existingManager) {
      existingManager.role = "employee";
      await existingManager.save();
    }

    // 🔥 6. PROMOTE / CREATE
    let manager;

    const existingMember = await departmentMemberModel.findOne({
      userId: assignedUserId,
      departmentId,
    });

    if (existingMember) {
      existingMember.role = "manager";
      manager = await existingMember.save();
    } else {
      manager = await departmentMemberModel.create({
        userId: assignedUserId,
        departmentId,
        role: "manager",
      });
    }

    const userName = assignedUser.userId?.name || "User";

    // 🔥 7. ACTIVITY
    await createActivity({
      workspaceId,
      departmentId,
      userId: adminId,
      type: "MANAGER_ASSIGNED",
      message: `${userName} was assigned as department manager`,
    });


    // 🔥 9. NOTIFICATION
    await createNotification({
      workspaceId,
      departmentId,
      userId: assignedUserId,
      type: "MANAGER_ASSIGNED",
      message: "Congratulations! You are now the department manager",
    });

    const io = getIO()

    io.to(assignedUserId.toString()).emit("manager-assigned", {
      departmentId,
    });

    // 🔥 10. RESPONSE
    return res.status(200).json({
      message: "Manager assigned successfully",
      manager,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
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
        message : `Member Added to Department`
    })

    await createNotification({
        workspaceId : workspace._id,
        departmentId : department._id,
        userId : newUserId,
        type : "MEMBER_ADDED",
        message : `you have been added in the department`
    })

    const io = getIO()

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
export async function deleteDepartment(req, res) {
  try {
    const userId = req.userId;
    const workspace = req.workspace;
    const department = req.department;

    const workspaceId = workspace._id;
    const departmentId = department._id;

    // 🔥 1. BLOCK GENERAL DEPARTMENT (NAME BASED)
    if (department.name === "general") {
      return res.status(400).json({
        message: "General department cannot be deleted",
      });
    }

    // 🔥 2. CHECK ADMIN
    const user = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // 🔥 3. DELETE ALL MEMBERS
    await departmentMemberModel.deleteMany({
      departmentId,
    });

    await workspaceModel.findByIdAndUpdate(workspaceId, {
      $inc: { departmentCount: -1 }
    });

    // 🔥 4. DELETE DEPARTMENT
    await departmentModel.findByIdAndDelete(departmentId);

    // 🔥 5. ACTIVITY LOG
    await createActivity({
      workspaceId,
      departmentId: null,
      userId,
      type: "DEPARTMENT_DELETED",
      message: `${department.name} department was deleted`,
    });


    // 🔥 7. RESPONSE
    return res.status(200).json({
      message: "Department deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
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
        userId,
        type : "DEPARTMENT_UPDATED",
        message : `department updated`
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
export async function getMyDepartments(req, res) {
  try {
    const userId = req.userId;
    const workspace = req.workspace;
    const workspaceId = workspace._id;

    const user = await workspaceMemberModel.findOne({ workspaceId, userId });

    if (!user) {
      return res.status(403).json({
        message: "User not in workspace",
      });
    }

    let departments = [];

    // 🔥 ADMIN → ALL DEPARTMENTS
    if (user.role === "admin") {
      departments = await departmentModel.find({ workspaceId });
    } else {
      const myDepartments = await departmentMemberModel
        .find({ userId })
        .populate({
          path: "departmentId",
          match: { workspaceId },
        });

      departments = myDepartments
        .filter((d) => d.departmentId !== null)
        .map((d) => d.departmentId);
    }

    // 🔥 ENRICH DATA (IMPORTANT PART)
    const enrichedDepartments = await Promise.all(
      departments.map(async (dept) => {

        // 👉 get manager
        const manager = await departmentMemberModel
          .findOne({
            departmentId: dept._id,
            role: "manager",
          })
          .populate("userId", "name profileImage");

        // 👉 count members
        const memberCount = await departmentMemberModel.countDocuments({
          departmentId: dept._id,
        });

        return {
          ...dept.toObject(),
          manager: manager?.userId || null,
          memberCount,
        };
      })
    );

    return res.status(200).json({
      message: "Departments fetched",
      departments: enrichedDepartments,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// *leaveDepartment
export async function leaveDepartment(req, res) {
  try {
    const workspace = req.workspace;
    const userId = req.userId;
    const department = req.department;

    const departmentId = department._id;
    const workspaceId = workspace._id;

    // 🔥 1. BLOCK GENERAL DEPARTMENT (name-based, case-insensitive)
    if ((department.name || "").toLowerCase() === "general") {
      return res.status(400).json({
        message: "You cannot leave the general department",
      });
    }

    // 🔥 2. CHECK WORKSPACE MEMBERSHIP
    const workspaceMember = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
    });

    if (!workspaceMember) {
      return res.status(403).json({
        message: "You are not part of this workspace",
      });
    }

    // 🔥 3. CHECK DEPARTMENT MEMBERSHIP + populate name
    const deptMember = await departmentMemberModel
      .findOne({ departmentId, userId })
      .populate("userId", "name");

    if (!deptMember) {
      return res.status(404).json({
        message: "You are not part of this department",
      });
    }

    const userName = deptMember.userId?.name || "User";

    // 🔥 4. FIND MANAGER
    const manager = await departmentMemberModel.findOne({
      departmentId,
      role: "manager",
    });

    // 🔥 5. REMOVE USER
    await departmentMemberModel.findOneAndDelete({
      userId,
      departmentId,
    });

    // 🔥 6. ACTIVITY
    await createActivity({
      workspaceId,
      departmentId,
      userId,
      type: "MEMBER_LEFT",
      message: `${userName} left the department`,
    });

    // 🔥 7. SOCKET (department room
    // 🔥 8. NOTIFY MANAGER (if exists & not same user)
    if (manager && manager.userId.toString() !== userId.toString()) {
      await createNotification({
        workspaceId,
        departmentId,
        userId: manager.userId,
        type: "MEMBER-LEFT",
        message: `${userName} left the department`,
      });

      const io = getIO()

      io.to(manager.userId.toString()).emit("member-left", {
        departmentId,
      });
    }

    // 🔥 9. RESPONSE
    return res.status(200).json({
      message: "You are no longer part of this department",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}



// * getAllDepartmentMembers
export async function getAllDepartmentMembers(req, res) {
  try {
    const userId = req.userId;
    const workspace = req.workspace;
    const department = req.department;

    const departmentId = department._id;
    const workspaceId = workspace._id;

    // 🔥 1. Check workspace membership
    const workspaceMember = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
    });

    if (!workspaceMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // 🔥 2. Check department membership
    const departmentMember = await departmentMemberModel.findOne({
      userId,
      departmentId,
    });

    if (!departmentMember && workspaceMember.role !== "admin") {
      return res.status(403).json({
        message: "You are not a member of this department",
      });
    }

    // 🔥 3. Get department members
    const departmentMembers = await departmentMemberModel
      .find({ departmentId })
      .populate("userId", "_id name email profileImage");

    // 🔥 4. Get tasks (NOT completed)
    const tasks = await taskModel.find({
      departmentId,
      status: { $in: ["pending", "in-progress", "awaiting-approval"] },
    });

    // 🔥 5. Create pending task map
    const pendingTaskCountMap = {};

    tasks.forEach((task) => {
      if (!task.assignedMembers?.length) return;

      task.assignedMembers.forEach((memberId) => {
        const id = memberId.toString();
        pendingTaskCountMap[id] =
          (pendingTaskCountMap[id] || 0) + 1;
      });
    });

    // 🔥 6. Final safeMembers with count
    const safeMembers = departmentMembers
      .filter((dm) => dm.userId)
      .map((dm) => {
        const user = dm.userId;
        const id = user._id.toString();

        return {
          userId: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
          },
          role: dm.role,
          pendingTasks: pendingTaskCountMap[id] || 0, // 🔥 MAIN FIX
        };
      });

    return res.status(200).json({
      message: "All department members fetched successfully",
      total: safeMembers.length,
      safeMembers,
    });

  } catch (error) {
    console.error("GET MEMBERS ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// * removeMemeberFromDepartment
export async function removeMemberFromDepartment(req,res) {
    try{
      const io = getIO()
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
        message : `Member removed from department`
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

export async function joinDepartment(req, res) {
  try {
    console.log('JOIN REQ API HIT');
    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    const departmentId = department._id;
    const workspaceId = workspace._id;

    // 🔹 check workspace member
    const workspaceMember = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
    }).populate("userId", "name");

    if (!workspaceMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    if (workspaceMember.role === "admin") {
      return res.status(403).json({
        message: "Admin cannot join any department",
      });
    }

    // 🔹 already member?
    const existingMember = await departmentMemberModel.findOne({
      userId,
      departmentId,
    });

    if (existingMember) {
      return res.status(400).json({
        message: "You are already a member of this department",
      });
    }

    // 🔹 already requested?
    const alreadyRequested = await joinRequestModel.findOne({
      userId,
      departmentId,
      type: "department",
      status: "pending",
    });

    if (alreadyRequested) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    // 🔥 CREATE REQUEST (IMPORTANT FIX)
    const request = await joinRequestModel.create({
      userId,
      workspaceId, // ✅ MUST ADD
      departmentId,
      type: "department",
      status: "pending",
    });

    // 🔥 FIND MANAGER (FIXED)
    const manager = await departmentMemberModel.findOne({
      departmentId,
      role: "manager",
    });

    // 🔥 NOTIFICATION (ONLY IF MANAGER EXISTS)
    if (manager) {
      const userName = workspaceMember.userId?.name || "User";

      await createNotification({
        workspaceId,
        departmentId,
        userId: manager.userId, // ✅ correct
        type: "JOIN_REQUEST",
        message: `${userName} requested to join ${department.name}`,
      });
      await createActivity({
  workspaceId,
  departmentId,
  userId,
  type: "JOIN_REQUEST_SENT",
  message: `Requested to join department`
})
    }


    return res.status(201).json({
      message: "Request sent successfully",
      request,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
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

await createActivity({
  workspaceId,
  departmentId,
  userId: request.userId,
  type: "MEMBER_JOINED",
  message: `User joined department`
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

await createActivity({
  workspaceId,
  departmentId,
  userId: request.userId,
  type: "JOIN_REQUEST_REJECTED",
  message: `Join request rejected`
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

export async function getAllDepartmentsOfThisWorkspace(req, res) {
  try {
    const userId = req.userId;
    const workspace = req.workspace;
    const workspaceId = workspace._id;

    // 🔥 1. Check workspace membership
    const workspaceMember = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
    });

    if (!workspaceMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // 🔥 2. Get all departments
    const departments = await departmentModel.find({ workspaceId });

    const deptIds = departments.map((d) => d._id);

    // 🔥 3. Get all department members
    const departmentMembers = await departmentMemberModel
      .find({
        departmentId: { $in: deptIds },
      })
      .populate("userId", "_id name email profileImage");

    // 🔥 4. Prepare maps
    const memberCountMap = {};
    const userMembershipSet = new Set();
    const managerMap = {};
    const userRoleMap = {}; // 👈 NEW

    departmentMembers.forEach((dm) => {
      const deptId = dm.departmentId.toString();

      // ✅ member count
      memberCountMap[deptId] = (memberCountMap[deptId] || 0) + 1;

      // ✅ isMember + role
      if (dm.userId._id.toString() === userId.toString()) {
        userMembershipSet.add(deptId);
        userRoleMap[deptId] = dm.role; // 👈 store role
      }

      // ✅ manager
      if (dm.role === "manager") {
        managerMap[deptId] = {
          _id: dm.userId._id,
          name: dm.userId.name,
          email: dm.userId.email,
          profileImage: dm.userId.profileImage,
        };
      }
    });

    // 🔥 5. Final response
    const result = departments.map((dept) => {
      const deptId = dept._id.toString();

      return {
        ...dept.toObject(),
        memberCount: memberCountMap[deptId] || 0,
        isMember: userMembershipSet.has(deptId),
        manager: managerMap[deptId] || null,
        role: userRoleMap[deptId] || null, // 👈 FINAL ADD
      };
    });

    return res.status(200).json({
      message: "All departments fetched successfully",
      departments: result,
      currentUserRole: workspaceMember.role, // workspace level role
    });

  } catch (error) {
    console.error("GET DEPARTMENTS ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}