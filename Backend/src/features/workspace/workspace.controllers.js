import userModel from "../../models/user.models.js";
import bcrypt from 'bcryptjs'
import workspaceModel from "../../models/workspace.models.js";
import workspaceMemberModel from "../../models/workspaceMember.models.js";
import departmentModel from "../../models/department.models.js";
import departmentMemberModel from "../../models/departmentMember.models.js";
import monthlyLeaderboardModel from "../../models/monthlyLeaderboard.models.js";
import joinRequestModel from "../../models/joinRequest.models.js";
import ImageKit from '@imagekit/nodejs' 
import { createNotification } from "../../utils/createNotification.js";
import { createActivity } from "../../utils/createActivity.js";
import mongoose from "mongoose";
import subscriptionModel from "../../models/subscription.models.js";


const imagekit = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});


export async function createWorkspaceService({
  userId,
  name,
  description,
  plan,
  payment = null,
  session
}) {
  // ✅ user fetch (for activity)
  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // ✅ normalize name
  name = name.toLowerCase().trim();

  // ✅ duplicate check
  const existing = await workspaceModel.findOne({ name });
  if (existing) {
    throw new Error("Workspace name already exists");
  }

  // ✅ workspace
  const workspaceArr = await workspaceModel.create(
    [{
      name,
      description,
      createdBy: userId,
      plan
    }],
    { session }
  );

  const workspace = workspaceArr[0];

  const startDate = new Date();

// 🔥 30 days add
const endDate = new Date();
endDate.setDate(endDate.getDate() + 30);

  // ✅ subscription
  const subscriptionArr = await subscriptionModel.create(
    [{
      workspaceId: workspace._id,
      plan,
      status: "active",
      startDate,
      endDate,
      amount: payment ? payment.amount : 0,
      paymentId: payment?.paymentId || null,
      orderId: payment?.orderId || null
    }],
    { session }
  );

  const subscription = subscriptionArr[0];

  // ✅ department (WITH SESSION)
  await departmentModel.create(
    [{
      name: "general",
      description: "This is general Department",
      workspaceId: workspace._id,
      createdBy: userId
    }],
    { session }
  );

  // ✅ member (WITH SESSION)
  await workspaceMemberModel.create(
    [{
      userId,
      workspaceId: workspace._id,
      role: "admin"
    }],
    { session }
  );

  // ✅ activity
  await createActivity({
    workspaceId: workspace._id,
    departmentId: null,
    userId,
    type: "WORKSPACE_CREATED",
    message: `${user.name} created the workspace`
  });

  // ✅ link subscription
  workspace.subscriptionId = subscription._id;
  await workspace.save({ session });

  // ✅ link payment
  if (payment) {
    payment.workspaceId = workspace._id;
    await payment.save({ session });
  }

  return workspace;
}

// 🔥 FREE PLAN (INDIVIDUAL)
export async function createFreeWorkspace(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.userId;
    const { name, description } = req.body;

    if (!name) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Name required" });
    }

    const workspace = await createWorkspaceService({
      userId,
      name,
      description,
      plan: "individual",
      session
    });

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Free workspace created",
      workspace
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
}



export async function getAllWorkspace(req, res) {
  try {
    const userId = req.userId;

    const workspaces = await workspaceModel
      .find()
      .select("name coverImage description createdBy createdAt")
      .populate("createdBy", "name email profileImage")
      .sort({ createdAt: -1 });

    const formatted = await Promise.all(
      workspaces.map(async (ws) => {

        // 👥 MEMBER COUNT
        const memberCount = await workspaceMemberModel.countDocuments({
          workspaceId: ws._id,
        });

        // 🔥 CHECK MEMBER
        const member = await workspaceMemberModel.findOne({
          workspaceId: ws._id,
          userId,
        });

        // 🔥 CHECK JOIN REQUEST
        const request = await joinRequestModel.findOne({
          workspaceId: ws._id,
          userId,
          type: "workspace",
        });

        return {
          ...ws.toObject(),
          memberCount,

          // ✅ JOINED
          isJoined: !!member,

          // ✅ REQUEST STATUS
          requestStatus: request?.status || null,
          // "pending" | "approved" | "rejected" | null
        };
      })
    );

    return res.status(200).json({
      message: "All Workspace Fetched Successfully",
      count: formatted.length,
      workspaces: formatted,
    });

  } catch (error) {
    console.error("GET ALL WORKSPACE ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function deleteWorkspace(req,res){
    
    try{
        const userId = req.userId

    const workspace = req.workspace
    const workspaceId = workspace._id

    if(workspace.createdBy.toString() !== userId){
        return res.status(403).json({
            messaege : "You are not allowed to delete this workspace"
        })
    }

    const departments = await departmentModel.find({workspaceId})

    const departmentIds = departments.map(d => d._id)

    await departmentMemberModel.deleteMany({
        departmentId : {$in: departmentIds}
    })

    await monthlyLeaderboardModel.deleteMany({workspaceId})

    await workspaceMemberModel.deleteMany({workspaceId})

    await departmentModel.deleteMany({workspaceId})

    await workspaceModel.findByIdAndDelete(workspaceId)


    res.status(200).json({
        message : "Workspace Deleted Successfully"
    })
    }catch(error){
        console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    }); 
    }
}

export async function updateWorkspace(req,res) {
    try{
        const userId = req.userId
    const workspace = req.workspace
    const workspaceId = workspace._id

    if(workspace.createdBy.toString() !== userId){
        return res.status(403).json({
            message : "You are not authorized to update this workspace"
        })
    }

    const {coverImage , description , joinPassword} = req.body;

    const updateData = {}

    if(description){
        updateData.description = description
    }
    if(coverImage){
       updateData.coverImage = coverImage
    }

    if(joinPassword){
        const hash = await bcrypt.hash(joinPassword , 10);
        updateData.joinPassword = hash
    }

    await workspaceModel.findByIdAndUpdate(workspaceId , updateData)

    res.status(200).json({
        message : "Workspace updated Successfully",

    })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}

// contoller to get a specific workspace
export async function getWorkspace(req,res) {
    const userId = req.userId

    const workspace = req.workspace
    const workspaceId = workspace._id

    const isValidUser = await workspaceMemberModel.findOne({
        workspaceId : workspaceId,
        userId : userId
    })

    if(!isValidUser){
        return res.status(403).json({
            message : "You are not a member of this workspace"
        })
    }

    const workspaceMembers = await workspaceMemberModel.find({workspaceId : workspaceId})
    .populate("userId", "name email profileImage role")

    return res.status(200).json({
        message : "workspace data fetched Successfully",
        workspace , 
        workspaceMembers
    })
}

export async function joinWorkspace(req,res) {
    try{
        const userId = req.userId;
    const {workspaceId} = req.params
    const workspace = await workspaceModel.findById(workspaceId).select("+joinPassword")

    if(!workspace){
        return res.status(404).json({
            message : "No workspace found"
        })
    }

    const existingUser = await workspaceMemberModel.findOne({
        workspaceId, userId
    })
    if(existingUser){
        return res.status(400).json({
            messaege : "you are already a member"
        })
    }

    const existingReq = await joinRequestModel.findOne({
        userId , workspaceId , departmentId : null
    })

    if(existingReq){
        return res.status(400).json({
            message : "Request already sent"
        })
    }

    const request = await joinRequestModel.create({
        userId : userId,
        workspaceId : workspaceId,
        status : "pending",
        departmentId : null,
        type : "workspace"
    })

    res.status(200).json({
        message : "Join Reqest sent successfully",
        request
    })
    } catch(error){
console.error(error);
   return res.status(500).json({
      message: "Internal Server Error"
   });
    }
}

export async function approveJoinRequest(req, res) {
  try {
    const adminId = req.userId;
    const { reqId } = req.params;

    // 🔥 1. FIND REQUEST
    const request = await joinRequestModel.findOne({
      _id: reqId,
      type: "workspace",
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        message: "No join request found",
      });
    }

    const workspaceId = request.workspaceId;
    const reqUserId = request.userId;

    // 🔥 2. CHECK ADMIN
    const isAdmin = await workspaceMemberModel.findOne({
      userId: adminId,
      workspaceId,
      role: "admin",
    });

    if (!isAdmin) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // 🔥 3. CHECK IF ALREADY MEMBER
    const alreadyMember = await workspaceMemberModel.findOne({
      userId: reqUserId,
      workspaceId,
    });

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already a member",
      });
    }

    // 🔥 4. ADD TO WORKSPACE
    await workspaceMemberModel.create({
      userId: reqUserId,
      workspaceId,
      role: "member",
    });

    // 🔥 5. GET GENERAL DEPARTMENT
    const generalDept = await departmentModel.findOne({
      workspaceId,
      name: "general",
    });

    let departmentId = null;

    if (generalDept) {
      departmentId = generalDept._id;

      // add to department
      await departmentMemberModel.create({
        userId: reqUserId,
        departmentId,
        role: "employee",
      });
    }

    // 🔥 6. GET DATA FOR MESSAGE
    const [workspace, user] = await Promise.all([
      workspaceModel.findById(workspaceId),
      userModel.findById(reqUserId),
    ]);

    const workspaceName = workspace?.name || "workspace";
    const userName = user?.name || "Someone";

    // 🔥 7. NOTIFICATION
    await createNotification({
      workspaceId,
      userId: reqUserId,
      type: "JOIN_REQUEST_APPROVED",
      message: `Your request to join ${workspaceName} has been approved`,
    });

    // 🔥 8. ACTIVITY (FIXED)
   await createActivity({
  workspaceId,
  departmentId: null,
  userId: reqUserId,
  type: "MEMBER_JOINED",
  message: `${userName} joined the workspace`,
});

    // 🔥 9. UPDATE STATUS
    request.status = "approved";
    await request.save();

    // 🔥 10. DELETE REQUEST
    await joinRequestModel.findByIdAndDelete(request._id);

    return res.status(200).json({
      message: "Request approved successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function rejectJoinRequest(req, res) {
  try {
    const { reqId } = req.params;
    const adminId = req.userId;

    // 🔥 1. FIND REQUEST
    const request = await joinRequestModel.findOne({
      _id: reqId,
      type: "workspace",
      status: "pending"
    });

    if (!request) {
      return res.status(404).json({
        message: "No pending join request found"
      });
    }

    const workspaceId = request.workspaceId;
    const requestedUserId = request.userId;

    // 🔥 2. CHECK ADMIN
    const admin = await workspaceMemberModel.findOne({
      workspaceId,
      userId: adminId
    });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to reject this request"
      });
    }

    // 🔥 3. GET WORKSPACE NAME (for message)
    const workspace = await workspaceModel.findById(workspaceId);

    const workspaceName = workspace?.name || "workspace";

    // 🔥 4. UPDATE STATUS (optional but clean)
    request.status = "rejected";
    await request.save();

    // 🔥 5. SEND NOTIFICATION TO USER
    await createNotification({
      workspaceId,
      userId: requestedUserId,
      type: "JOIN_REQUEST_REJECTED",
      message: `Your request to join ${workspaceName} has been rejected`
    });

    // 🔥 6. DELETE REQUEST (optional)
    await joinRequestModel.findByIdAndDelete(request._id);

    await createActivity({
  workspaceId,
  departmentId: null,
  userId: requestedUserId,
  type: "JOIN_REQUEST_REJECTED",
  message: `Join request was rejected`,
});

    return res.status(200).json({
      message: "Request rejected successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}
// getMyWorkspaces
export async function getMyWorkspaces(req,res){
    try{
        const userId = req.userId;
    const workspaces = await workspaceMemberModel
    .find({userId})
    .populate("workspaceId", "name coverImage description createdBy")
    res.status(200).json({
        message : "All workspaces fetched for user",
        workspaces : workspaces
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

// leaveWorkspace
export async function leaveWorkspace(req,res){
    try{
        const userId = req.userId;
        const workspace = req.workspace
        const workspaceId = workspace._id;

        const isUserInWorkspace = await workspaceMemberModel.findOne({
            userId , workspaceId
        })

        if(!isUserInWorkspace) {
            return res.status(403).json({
                message : "User is not the part of this workspace"
            })
        }

        const adminCount = await workspaceMemberModel.countDocuments({
            workspaceId , role : "admin"
        })

        if(adminCount === 1 && isUserInWorkspace.role === "admin"){
            return res.status(403).json({
                message : "Assign another admin before leaving"
            })
        }

       

    await workspaceMemberModel.findOneAndDelete({
        userId : userId, workspaceId : workspaceId
    })

    await joinRequestModel.deleteMany({
        userId , workspaceId
    })

    const departments = await departmentModel
    .find({workspaceId})
    .select("_id")

    const departmentIds = departments.map(d => d._id)
    // before delete

const user = await userModel.findById(userId);

await createActivity({
  workspaceId,
  departmentId: null,
  userId,
  type: "MEMBER_LEFT",
  message: `${user.name} left the workspace`,
});

    await departmentMemberModel.deleteMany({
        userId,
        departmentId : {$in : departmentIds}
    })

    res.status(200).json({
        message : "You are no more part of this workspace"
    })



    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

// getPendingRequests
export async function getAllPendingRequestsForWorkspace(req, res) {
  try {
    const userId = req.userId;
    const workspaceId = req.workspace?._id;

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace not found in request",
      });
    }

    // 🔥 Check membership
    const member = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
    });

    if (!member) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // 🔥 Check admin
    if (member.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can view join requests",
      });
    }

    // 🔥 Fetch requests
    const requests = await joinRequestModel
      .find({
        workspaceId,
        status: "pending",
        type: "workspace",
      })
      .populate("userId", "name email profileImage")
      .sort({ createdAt: -1 }); // 🔥 latest first

    return res.status(200).json({
      message: "All pending requests fetched successfully",
      requests,
      role: member.role, // 🔥 IMPORTANT (frontend ke liye)
    });

  } catch (error) {
    console.error("GET REQUESTS ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// removeMember
export async function removeMember(req,res){
    try{
        const userId = req.userId;
        const {removeUserId} = req.params

        const workspace = req.workspace
        const workspaceId = workspace._id

        const isUserMember = await workspaceMemberModel.findOne({
            userId : removeUserId , workspaceId
        })

        const isUserAdmin = await workspaceMemberModel.findOne({
            userId , workspaceId
        })

        if(!isUserAdmin){
            return res.status(404).json({
                messaege : "You are not part of this Workspace"
            })
        }


        if(isUserAdmin.role !== 'admin'){
            return res.status(403).json({
                message : "You are not authorized to remove a member from this workspace"
            })
        }

        if(removeUserId === userId){
            return res.status(400).json({
                message : "Use leave Workspace instead"
            })
        }

        if(!isUserMember) {
            return res.status(404).json({
                message : "user is not a member of this workspace"
            })
        }

        if(isUserMember.role === 'admin'){
            return res.status(403).json({
                message : "Admins cannot be removed"
            })
        }

        

        await joinRequestModel.deleteMany({
            userId : removeUserId , workspaceId
        })

        await workspaceMemberModel.deleteOne({
            userId : removeUserId,
            workspaceId
        })

        const departments = await departmentModel
        .find({workspaceId})
        .select("_id")

        const departmentIds = departments.map(d => d._id)
        const removedUser = await userModel.findById(removeUserId);

await createActivity({
  workspaceId,
  departmentId: null,
  userId: removeUserId,
  type: "MEMBER_REMOVED",
  message: `${removedUser.name} was removed from workspace`,
});

        await departmentMemberModel.deleteMany({
            userId : removeUserId , 
            departmentId : {$in : departmentIds}
        })

        res.status(200).json({
            message : "User removed Successfully",
        })

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

// changeMemberRole
export async  function changeMemberRole(req,res){
    try{
        const {targetUserId} = req.params
    const adminId = req.userId
   const workspace = req.workspace
        const workspaceId = workspace._id

    const user = await workspaceMemberModel.findOne({
        userId : targetUserId  , workspaceId
    })

    if(!user){
        return res.status(404).json({
            messaege : "User is not a member of workspace"
        })
    }

    const admin = await workspaceMemberModel.findOne({
        userId : adminId , workspaceId
    })

    if(!admin){
        return res.status(404).json({
            message : "You are not a member of this workspace"
        })
    }

    if(admin.role !== 'admin'){
        return res.status(403).json({
            message : "You are not authorized to change the role of a member"
        })
    }

    if(user.role === 'admin' ){
        return res.status(403).json({
            message : "You cannot change the role of an admin"
        })
    }

    user.role = 'admin'
    await user.save()
    await createActivity({
  workspaceId,
  departmentId: null,
  userId: targetUserId,
  type: "ROLE_UPDATED",
  message: `User promoted to admin`,
});

    res.status(200).json({
        message : "User role changed successfully",
        user
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal server error"
        })
    }

}

//getWorkspaceMembers
export async function getWorkspaceMembers(req,res) {
    try{
        const userId = req.userId
   const workspace = req.workspace
        const workspaceId = workspace._id

    const user = await workspaceMemberModel.findOne({
        userId , workspaceId
    })

    if(!user){
        return res.status(400).json({
            message : "You are not authorized to access members of this workspace"
        })
    }

    const members = await workspaceMemberModel.find({workspaceId})
    .populate("userId" , "name email username profileImage")

    return res.status(200).json({
        message : "Members of workspace fetched successfully",
        members
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }

}

// workspaceStats
export async function workspaceStats(req, res) {
  try {
    const userId = req.userId;
    const workspace = req.workspace;
    const workspaceId = workspace._id;

    // 🔥 GET WORKSPACE
    const workspaceData = await workspaceModel
      .findById(workspaceId)
      .populate("createdBy", "name email");

    if (!workspaceData) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // 🔥 CHECK USER IS MEMBER
    const member = await workspaceMemberModel.findOne({
      userId,
      workspaceId,
    });

    if (!member) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // 🔥 COUNTS
    const totalMembers = await workspaceMemberModel.countDocuments({
      workspaceId,
    });

    const departments = await departmentModel.find({ workspaceId });

    const totalAdmins = await workspaceMemberModel.countDocuments({
      workspaceId,
      role: "admin",
    });

    const totalPendingRequests = await joinRequestModel.countDocuments({
      workspaceId,
      type: "workspace",
      status: "pending",
    });

    const top3 = await monthlyLeaderboardModel
      .find({ workspaceId })
      .sort({ month: -1 })
      .limit(1);

    // 🔥 ADMIN CHECK (FINAL FIX)
    const isAdmin =
      workspaceData.createdBy._id.toString() === userId.toString();

    // 🔥 RESPONSE
    return res.status(200).json({
      message: "Workspace stats fetched successfully",

      workspace: {
        _id: workspaceData._id,
        name: workspaceData.name,
        coverImage: workspaceData.coverImage,
        createdBy: workspaceData.createdBy,
      },

      totalMembers,
      totalDepartments: departments.length,
      totalAdmins,
      departments,
      totalPendingRequests,
      top3,

      isAdmin, // 🔥 IMPORTANT
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


export async function searchWorkspaces(req, res) {
  try {
    const { query } = req.query;
    const userId = new mongoose.Types.ObjectId(req.userId);

    let workspaces = [];

    // ================== FETCH WORKSPACES ==================
    if (!query || query.trim() === "") {
      // 🔥 RANDOM (EXPLORE MODE)
      workspaces = await workspaceModel.aggregate([
        { $sample: { size: 10 } },

        // 👤 CREATOR INFO
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
          },
        },
        { $unwind: "$createdBy" },

        // 👥 MEMBER COUNT
        {
          $lookup: {
            from: "workspacemembers",
            localField: "_id",
            foreignField: "workspaceId",
            as: "members",
          },
        },
        {
          $addFields: {
            memberCount: { $size: "$members" },
          },
        },

        // 🔥 CLEAN DATA
        {
          $project: {
            name: 1,
            description: 1,
            coverImage: 1,
            createdAt: 1,
            memberCount: 1,
            createdBy: {
              _id: 1,
              name: 1,
              email: 1,
              profileImage: 1,
            },
          },
        },
      ]);
    } else {
      // 🔥 SEARCH MODE
      workspaces = await workspaceModel.aggregate([
        {
          $match: {
            name: { $regex: query, $options: "i" },
          },
        },
        { $limit: 10 },

        // 👤 CREATOR
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
          },
        },
        { $unwind: "$createdBy" },

        // 👥 MEMBERS
        {
          $lookup: {
            from: "workspacemembers",
            localField: "_id",
            foreignField: "workspaceId",
            as: "members",
          },
        },
        {
          $addFields: {
            memberCount: { $size: "$members" },
          },
        },

        {
          $project: {
            name: 1,
            description: 1,
            coverImage: 1,
            createdAt: 1,
            memberCount: 1,
            createdBy: {
              _id: 1,
              name: 1,
              email: 1,
              profileImage: 1,
            },
          },
        },
      ]);
    }

    // ================== USER RELATION ==================

    const memberships = await workspaceMemberModel.find({ userId });
    const joinedIds = memberships.map((m) => m.workspaceId.toString());

    const requests = await joinRequestModel.find({
      userId,
      type: "workspace",
      status: "pending",
    });

    const requestedIds = requests.map((r) =>
      r.workspaceId?.toString()
    );

    // ================== FINAL FORMAT ==================

    const results = workspaces.map((ws) => {
      let status = "none";

      if (joinedIds.includes(ws._id.toString())) {
        status = "joined";
      } else if (requestedIds.includes(ws._id.toString())) {
        status = "requested";
      }

      return {
        ...ws,
        status,
      };
    });

    return res.status(200).json({
      message: "Workspaces fetched successfully",
      count: results.length,
      workspaces: results,
    });

  } catch (error) {
    console.error("SEARCH WORKSPACE ERROR:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
}