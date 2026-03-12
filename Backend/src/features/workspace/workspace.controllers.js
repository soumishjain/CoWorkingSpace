import userModel from "../../models/user.models.js";
import bcrypt from 'bcryptjs'
import workspaceModel from "../../models/workspace.models.js";
import workspaceMemberModel from "../../models/workspaceMember.models.js";
import departmentModel from "../../models/department.models.js";
import departmentMemberModel from "../../models/departmentMember.models.js";
import monthlyLeaderboardModel from "../../models/monthlyLeaderboard.models.js";
import joinRequestModel from "../../models/joinRequest.models.js";
import ImageKit from '@imagekit/nodejs' 

const imagekit = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});


export async function createWorkspace(req,res){
    
    try{
        const userId = req.userId;
    const user = await userModel.findById(userId)

    if(!user){
        return res.status(401).json({
            message : "Unauthorized Access"
        })
    }

    let {name , description , joinPassword} = req.body;
    if(!name || !joinPassword){
        return res.status(400).json({
            messsage : "Please fill All the Details"
        })
    }

    name = name.toLowerCase()

    const isNameAlreadyExists = await workspaceModel.findOne({name})

    if(isNameAlreadyExists){
        return res.status(409).json({
            messaege : "Workspace with this name already exists"
        })
    }

    const hash = await bcrypt.hash(joinPassword,10);

    let coverImageUrl;

     if(req.file){
     const file = await imagekit.files.upload({
        file : await toFile(Buffer.from(req.file.buffer) , 'workspacecover.jpg'),
        fileName : `workspace-${Date.now()}`,
        folder : '/coworkingspace/workspace/coverImage'
     })
     coverImageUrl = file
    }


    const workspace = await workspaceModel.create({
        name , description , coverImage : coverImageUrl, joinPassword : hash , createdBy : userId
    })

    const generalDept = await departmentModel.create({
        name : "general",
        description : "This is general Department",
        workspaceId : workspace._id,
        createdBy : userId
    })

    await workspaceMemberModel.create({
        userId : userId,
        workspaceId : workspace._id,
        role : "admin"
    })

    res.status(201).json({
        messaege : "workspace created successfully",
        workspace : {
            id : workspace._id,
            name : workspace.name ,
            description : workspace.description,
            coverImage : workspace.coverImage,
            createdBy : workspace.createdBy
        }
    })
    } catch(error){
        console.error(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
    }
}

export async function getAllWorkspace(req,res){

    try{
    
    const allWorkspace = await workspaceModel.find()
    .select("name coverImage description createdBy")
    .populate("createdBy", "name email")

    return res.status(200).json({
        message : "All Workspace Fetched Successfully",
        count : allWorkspace.length,
        allWorkspace
    })
}catch(error){
     console.error(error);
    return res.status(500).json({
      message: "Internal Server Error"
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

    const { joinPassword } = req.body

    if(!joinPassword) {
        return res.status(400).json({
            message : "Password Required"
        })
    }

    const isMatch = await bcrypt.compare(joinPassword , workspace.joinPassword)

    if(!isMatch){
        return res.status(403).json({
            message : "Invalid Credentials"
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

export async function approveJoinRequest(req,res){
    try{
        const userId = req.userId
    const {reqId} = req.params

    const isReqExist = await joinRequestModel.findOne({
        _id : reqId,
        type : "workspace",
        status : "pending"
    })

    if(!isReqExist) {
        return res.status(404).json({
            message : "No join request found"
        })
    }

    const workspaceId = isReqExist.workspaceId

    const isUserAdmin = await workspaceMemberModel.findOne({
        userId : userId, workspaceId , role : "admin"
    })

    if(!isUserAdmin) {
        return res.status(403).json({
            message : "You are not authorized to accept join request"
        })
    }

    const reqUserId = isReqExist.userId

    const alreadyMember = await workspaceMemberModel.findOne({
        userId : reqUserId,
        workspaceId
    })

    if(alreadyMember){
        return res.status(400).json({
            message : "User already a member"
        })
    }

    await workspaceMemberModel.create({
        userId : reqUserId , workspaceId , role : "member"
    })

    const generalDept = await departmentModel.findOne({
        workspaceId,
        name : "general"
    })

    if(generalDept){
        await departmentMemberModel.create({
            userId : reqUserId,
            departmentId: generalDept._id,
            role: "employee"
        })
    }

    isReqExist.status = "approved"
    await isReqExist.save()


    res.status(200).json({
        message : "Request approved successfully"
    })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal server error"
        })
    }

}

export async function rejectJoinRequest(req,res){
    try{
        const {reqId} = req.params
        const userId = req.userId
        const request = await joinRequestModel.findOne({
      _id: reqId,
      type: "workspace",
      status: "pending"
    });
        if(!request){
            return res.status(404).json({
                message : "No pending join request found"
            })
        }

        const workspaceId = request.workspaceId

        const user = await workspaceMemberModel.findOne({
            workspaceId : workspaceId , userId : userId
        })

        if(!user || user.role !== "admin"){
            return res.status(403).json({
                messaege : "You are not authorized to reject this request"
            })
        }

        request.status = "rejected"
        await request.save()

        await joinRequestModel.findByIdAndDelete(request._id)

        return res.status(200).json({
            message : "Request rejected successfully"
        })


    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
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
export async function getAllPendingRequestsForWorkspace(req,res){
    try{
        const userId = req.userId;
    const workspace = req.workspace
        const workspaceId = workspace._id

    const user = await workspaceMemberModel.findOne({
        userId , workspaceId
    })

    if(!user) {
        return res.status(404).json({
            message : "You are not a member of this workspace"
        })
    }

    if(user.role !== 'admin'){
        return res.status(403).json({
            message : "You are not the admin for this workspace"
        })
    }

    const requests = await joinRequestModel.find({
        workspaceId , status: 'pending' , type : 'workspace'
    }).populate("userId" , "name email profileImage")

    res.status(200).json({
        message : "All requests fethced successfully",
        requests
    })
    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server error"
        })
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
export async function workspaceStats(req,res){
    try{
    const adminId = req.userId

    const workspace = req.workspace
        const workspaceId = workspace._id


    const admin = await workspaceMemberModel.findOne({
        userId : adminId, workspaceId
    })

    if(!admin || admin.role !== 'admin') {
        return res.status(403).json({
            message : "Not authorized"
        })
    }

    const workspaceMembers = await workspaceMemberModel.countDocuments({workspaceId})
    const departments = await departmentModel.find({workspaceId})
    const adminCount = await workspaceMemberModel.countDocuments({workspaceId , role : 'admin'})
    const pendingRequests = await joinRequestModel.countDocuments({workspaceId , type : 'workspace' , status : 'pending'})
    const top3 = await monthlyLeaderboardModel.find({workspaceId})
    .sort({month: -1})
    .limit(1)

    res.status(200).json({
        message : "Workspace stats fetched successfully",
        totalMembers : workspaceMembers,
        totalDepartments : departments.length,
        totalAdmins : adminCount,
        departments : departments,
        totalPendingRequests : pendingRequests,
        top3 : top3
    })

    }catch(error){
        console.error(error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}