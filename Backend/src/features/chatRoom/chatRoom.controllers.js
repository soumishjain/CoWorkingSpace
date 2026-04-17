import chatRoomModel from "../../models/chatRoom.models.js";
import messageModel from "../../models/message.models.js";
import workspaceModel from "../../models/workspace.models.js";
import workspaceMemberModel from "../../models/workspaceMember.models.js";
import { PLANS } from "../../utils/plans.js";


export const createChatRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    /* ================= VALIDATION ================= */
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Chat room name is required",
      });
    }

    /* ================= ROLE CHECK ================= */
    const member = await workspaceMemberModel.findOne({
      workspaceId: workspace._id,
      userId,
    });

    if (!member || !["admin", "manager"].includes(member.role)) {
      return res.status(403).json({
        message: "Only admins or managers can create chat rooms",
      });
    }

    /* ================= PLAN LIMIT ================= */
    const chatRoomCount = await chatRoomModel.countDocuments({
      workspaceId: workspace._id,
      departmentId: department._id,
    });

    // 🔥 FIXED PLAN LOGIC
    const planData = PLANS[workspace.plan];
    const limit = planData?.limits?.chatroomsPerDepartment;

    console.log("🔥 PLAN:", workspace.plan);
    console.log("🔥 LIMIT:", limit);
    console.log("🔥 CURRENT COUNT:", chatRoomCount);

    if (limit !== undefined && chatRoomCount >= limit) {
      return res.status(403).json({
        message: "Chatroom limit reached. Upgrade your plan.",
      });
    }

    /* ================= DUPLICATE CHECK ================= */
    const existingChatRoom = await chatRoomModel.findOne({
      workspaceId: workspace._id,
      departmentId: department._id,
      name: name.trim(),
    });

    if (existingChatRoom) {
      return res.status(409).json({
        message:
          "Chat room with the same name already exists in this department",
      });
    }

    /* ================= CREATE ================= */
    const chatRoom = await chatRoomModel.create({
      workspaceId: workspace._id,
      departmentId: department._id,
      name: name.trim(),
      members: [userId],
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Chat room created successfully",
      chatRoom,
    });
  } catch (error) {
    console.error("❌ Error creating chat room:", error);

    return res.status(500).json({
      message: "Server error while creating chat room",
    });
  }
};

export const getChatRooms = async (req, res) => {
  try {
    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    /* ================= VALIDATE MEMBER ================= */
    const member = await workspaceMemberModel.findOne({
      workspaceId: workspace._id,
      userId,
    });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    /* ================= ROLE ================= */
    const role = member.role;

    /* ================= PLAN ================= */
    const workspaceData = await workspaceModel.findById(workspace._id);
    const plan = workspaceData?.plan || "individual";

    /* ================= QUERY ================= */
    const query = {
      workspaceId: workspace._id,
      departmentId: department._id,
    };

    if (role === "member") {
      query.members = userId;
    }

    /* ================= FETCH ROOMS ================= */
    const chatRooms = await chatRoomModel
      .find(query)
      .select("name createdAt members departmentId") // 🔥 FIX
      .sort({ createdAt: 1 })
      .lean();

    console.log("🔥 RAW CHAT ROOMS:", chatRooms);

    /* ================= FORMAT ================= */
    const formattedRooms = chatRooms.map((room) => ({
      _id: room._id,
      name: room.name,
      createdAt: room.createdAt,

      // 🔥 REQUIRED FOR FRONTEND
      memberCount: room.members?.length || 0,
      members: room.members || [], // 🔥 ADD THIS
      departmentId: room.departmentId, // 🔥 ADD THIS
    }));

    console.log("🔥 FORMATTED ROOMS:", formattedRooms);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Chat rooms retrieved successfully",
      chatRooms: formattedRooms,
      meta: {
        role,
        plan,
      },
    });

  } catch (error) {
    console.error("Error retrieving chat rooms:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteChatRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    // ✅ CHECK MANAGER
    const isManager = await workspaceMemberModel.exists({
      workspaceId: workspace._id,
      userId,
      role: "manager"
    });

    if (!isManager) {
      return res.status(403).json({
        message: "Only managers can delete chat rooms"
      });
    }

    // ✅ FIND ROOM
    const chatRoom = await chatRoomModel.findOne({
      _id: chatRoomId,
      workspaceId: workspace._id,
      departmentId: department._id
    });

    if (!chatRoom) {
      return res.status(404).json({
        message: "Chat room not found"
      });
    }

    // 🚨 PROTECT GENERAL ROOM
    if (chatRoom.name.toLowerCase() === "general") {
      return res.status(400).json({
        message: "General room cannot be deleted"
      });
    }

    // ✅ DELETE ALL MESSAGES (HARD DELETE)
    await messageModel.deleteMany({
      chatRoomId: chatRoomId
    });

    // ✅ DELETE CHAT ROOM
    await chatRoomModel.deleteOne({
      _id: chatRoomId
    });

    return res.status(200).json({
      message: "Chat room deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting chat room:", error);
    return res.status(500).json({
      message: "Server error while deleting chat room"
    });
  }
};

export const chatRoomById = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    // ✅ ONLY IF USER IS MEMBER OF ROOM
    const chatRoom = await chatRoomModel.findOne({
      _id: chatRoomId,
      workspaceId: workspace._id,
      departmentId: department._id,
      members: userId   // 🔥 IMPORTANT FIX
    }).select("name members createdAt");

    if (!chatRoom) {
      return res.status(404).json({
        message: "Chat room not found or access denied"
      });
    }

    return res.status(200).json({
      message: "Chat room retrieved successfully",
      chatRoom: {
        _id: chatRoom._id,
        name: chatRoom.name,
        createdAt: chatRoom.createdAt,
        memberCount: chatRoom.members.length // 🔥 instead of full populate
      }
    });

  } catch (error) {
    console.error("Error fetching chat room:", error);
    return res.status(500).json({
      message: "Server error while fetching chat room"
    });
  }
};

export const addMemberToChatRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { memberId } = req.body;
    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    /* ================= ROLE CHECK ================= */
    const user = await workspaceMemberModel.findOne({
      workspaceId: workspace._id,
      userId,
    });

    if (!user || !["admin", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only admin or manager can add members",
      });
    }

    /* ================= VALIDATE MEMBER ================= */
    const isWorkspaceMember = await workspaceMemberModel.exists({
      workspaceId: workspace._id,
      userId: memberId,
    });

    if (!isWorkspaceMember) {
      return res.status(400).json({
        message: "User is not part of workspace",
      });
    }

    /* ================= ADD MEMBER ================= */
    const updatedRoom = await chatRoomModel.findOneAndUpdate(
      {
        _id: chatRoomId,
        workspaceId: workspace._id,
        departmentId: department._id,
      },
      {
        $addToSet: { members: memberId },
      },
      { new: true }
    ).select("name members departmentId");

    if (!updatedRoom) {
      return res.status(404).json({
        message: "Chat room not found",
      });
    }

    return res.status(200).json({
      message: "Member added successfully",
      chatRoom: {
        _id: updatedRoom._id,
        name: updatedRoom.name,
        memberCount: updatedRoom.members.length,
        members: updatedRoom.members,
        departmentId: updatedRoom.departmentId,
      },
    });

  } catch (error) {
    console.error("Add member error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const removeMemberFromChatRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { memberId } = req.body;
    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    /* ================= ROLE CHECK ================= */
    const user = await workspaceMemberModel.findOne({
      workspaceId: workspace._id,
      userId,
    });

    if (!user || !["admin", "manager"].includes(user.role)) {
      return res.status(403).json({
        message: "Only admin or manager can remove members",
      });
    }

    /* ================= REMOVE MEMBER ================= */
    const updatedRoom = await chatRoomModel.findOneAndUpdate(
      {
        _id: chatRoomId,
        workspaceId: workspace._id,
        departmentId: department._id,
      },
      {
        $pull: { members: memberId },
      },
      { new: true }
    ).select("name members departmentId");

    if (!updatedRoom) {
      return res.status(404).json({
        message: "Chat room not found",
      });
    }

    return res.status(200).json({
      message: "Member removed successfully",
      chatRoom: {
        _id: updatedRoom._id,
        name: updatedRoom.name,
        memberCount: updatedRoom.members.length,
        members: updatedRoom.members,
        departmentId: updatedRoom.departmentId,
      },
    });

  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};