import departmentMemberModel from "../../models/departmentMember.models.js"
import joinRequestModel from "../../models/joinRequest.models.js"
import notificationModel from "../../models/notification.models.js"
import workspaceMemberModel from "../../models/workspaceMember.models.js"

export async function getMyNotification(req,res){
    try{
        const userId = req.userId

        const notification = await notificationModel.find({userId})
        .sort({createdAt : -1})
        .limit(50)

        res.status(200).json({
            notification
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function markNotification(req,res) {
    try{

        const {notificationId} = req.params
        const userId = req.userId
        const notification = await notificationModel.findOne({
            _id : notificationId,
            userId
        })

        if(!notification) {
            return res.status(404).json({
                message : "Notification not found"
            })
        }

        notification.isRead = true;
        await notification.save()

        res.status(200).json({
            message : "Notification marked as read"
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal server error"
        })
    }
}

export async function markAllNotificationAsRead(req,res){
    try{
        const userId = req.userId

        await notificationModel.updateMany({
            userId ,
            isRead : false
        },
    {
        $set : {isRead : true}
    })


    return res.status(200).json({
        message : "All notification marked as read"
    })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export async function getUnreadNotificationCount(req,res){
    try{

        const userId = req.userId
        const count = await notificationModel.countDocuments({
            userId , 
            isRead : false
        })

        return res.status(200).json({
            message : "Unread notification count fetched",
            count
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            message : "Internsal Server Error"
        })
    }
}
export async function getMyRequests(req, res) {
  try {
    console.log("🔥 GLOBAL REQ API HIT");

    const userId = req.userId;

    // 🔥 find all memberships (user kaha-kaha hai)
    const memberships = await workspaceMemberModel.find({ userId });

    if (!memberships.length) {
      return res.status(200).json({
        requests: [],
        role: "",
      });
    }

    const workspaceIds = memberships.map((m) => m.workspaceId);

    // 🔥 check roles (important)
    const adminWorkspaceIds = memberships
      .filter(m => m.role === "admin")
      .map(m => m.workspaceId);

    let requests = [];

    // ✅ ADMIN → Workspace-level join requests ONLY (no departmentId)
    if (adminWorkspaceIds.length > 0) {
      requests = await joinRequestModel
        .find({
          workspaceId: { $in: adminWorkspaceIds },
          departmentId: { $in: [null, undefined] },
          status: "pending",
        })
        .populate("userId", "name email profileImage")
        .populate("departmentId", "name");
    } 
    
    // ✅ MANAGER → only their department requests
    const managedDepartments = await departmentMemberModel.find({
      userId,
      role: "manager",
    });

    const deptIds = managedDepartments.map((d) => d.departmentId);

    let deptRequests = [];
    if (deptIds.length > 0) {
      deptRequests = await joinRequestModel
        .find({
          departmentId: { $in: deptIds },
          status: "pending",
        })
        .populate("userId", "name email profileImage")
        .populate("departmentId", "name");
    }

    // Combine: workspace requests (admins only) + department requests (managers only)
    requests = [...requests, ...deptRequests];

    console.log("✅ GLOBAL REQUESTS:", requests);

    return res.status(200).json({
      requests,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}