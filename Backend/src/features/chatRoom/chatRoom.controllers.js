import chatRoomModel from "../../models/chatRoom.models";
import messageModel from "../../models/message.models";
import workspaceMemberModel from "../../models/workspaceMember.models";

export const createChatRoom = async (req, res) => {
  try { 
    const { name } = req.body;
    const workspace = req.workspace;
    const department = req.department;
    const userId = req.userId;

    if(!name || name.trim() === ""){
      return res.status(400).json({
        message : "Chat room name is required"
      })
    }

    const manager = await workspaceMemberModel.findOne({
      workspaceId : workspace._id,
      userId,
      role : "manager"
    })

    if(!manager){
      return res.status(403).json({
        message : "Only managers can create chat rooms"
      })
    }

      const existingChatRoom = await chatRoomModel.findOne({
      workspaceId : workspace._id,
      departmentId : department._id,
      name : name.trim()
    })

    if(existingChatRoom){
      return res.status(409).json({
        message : "Chat room with the same name already exists in this department"
      })
    }

    const chatRoom = await chatRoomModel.create({
      workspaceId : workspace._id,
      departmentId : department._id,
      name : name.trim(),
        members : [userId],
        createdBy : userId
    })

    return res.status(201).json({
      message : "Chat room created successfully",
      chatRoom
    })
  }catch(error){
    console.error("Error creating chat room:", error);
    return res.status(500).json({       
        message : "Server error while creating chat room"
    })
  }
}

export const getChatRooms = async (req, res) => {
    try {
        const workspace = req.workspace;
        const department = req.department;
        const userId = req.userId;

        const isMember = await workspaceMemberModel.findOne({
            workspaceId : workspace._id,
            userId
        })
        if(!isMember){
            return res.status(403).json({
                message : "Only workspace members can view chat rooms"
            })
        }

        const chatRooms = await chatRoomModel.find({
            workspaceId: workspace._id,
            departmentId: department._id
        }).populate("members", "name email");

        return res.status(200).json({
            message: "Chat rooms retrieved successfully",
            chatRooms
        });
    } catch (error) {
        console.error("Error retrieving chat rooms:", error);
        return res.status(500).json({   
            message: "Server error while retrieving chat rooms"
        });
    }   
}

export const deleteChatRoom = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        const workspace = req.workspace;
        const department = req.department;
        const userId = req.userId;

        const manager = await workspaceMemberModel.findOne({
            workspaceId : workspace._id,
            userId,
            role : "manager"
        })

        if(!manager){
            return res.status(403).json({
                message : "Only managers can delete chat rooms"
            })
        }

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

        await chatRoomModel.findByIdAndDelete(chatRoomId);

        await messageModel.deleteMany({
            chatRoomId: chatRoomId
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
}

export const chatRoomById = async (req, res) => {
    try {
        const { chatRoomId } = req.params;
        const workspace = req.workspace;
        const department = req.department;  
        const chatRoom = await chatRoomModel.findOne({
            _id: chatRoomId,
            workspaceId: workspace._id,
            departmentId: department._id
        }).populate("members", "name email");
        if (!chatRoom) {
            return res.status(404).json({
                message: "Chat room not found"
            });
        }
        return res.status(200).json({
            message: "Chat room retrieved successfully",
            chatRoom
        });
    } catch (error) {
        console.error("Error fetching chat room:", error);
        return res.status(500).json({
            message: "Server error while fetching chat room"
        });
    }   
}

export const addMemberToChatRoom = async (req, res) => {
    try {
        const { chatRoomId } = req.params;  
        const { memberId } = req.body;
        const workspace = req.workspace;
        const department = req.department;  
        const userId = req.userId;
        const manager = await workspaceMemberModel.findOne({
            workspaceId : workspace._id,
            userId,
            role : "manager"
        })  

        if(!manager){
            return res.status(403).json({
                message : "Only managers can add members to chat rooms"
            })
        }

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

        const userIsMember = await workspaceMemberModel.findOne({
            workspaceId : workspace._id,
            userId : memberId
        })

            if(!userIsMember){
                return res.status(400).json({
                    message : "User is not a member of the workspace"
                })
            }

        const isMember = chatRoom.members.some(member => member.toString() === memberId);
         if (isMember) {
            return res.status(400).json({
                message: "User is already a member of this chat room"
            });
        }

        chatRoom.members.push(memberId);
        await chatRoom.save();
        return res.status(200).json({
            message: "Member added to chat room successfully",
            chatRoom
        });
    } catch (error) {
        console.error("Error adding member to chat room:", error);
        return res.status(500).json({           
            message: "Server error while adding member to chat room"
        });
    }
}

export const removeMemberFromChatRoom = async (req, res) => {
    try {
        const { chatRoomId } = req.params;  
        const { memberId } = req.body;
        const workspace = req.workspace;

        const department = req.department;
        const userId = req.userId;
        const manager = await workspaceMemberModel.findOne({    
            workspaceId : workspace._id,
            userId,
            role : "manager"
        })  
        if(!manager){
            return res.status(403).json({
                message : "Only managers can remove members from chat rooms"
            })
        }

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

        const isMember = chatRoom.members.some(member => member.toString() === memberId);

        if (!isMember) {
            return res.status(400).json({
                message: "User is not a member of this chat room"
            });
        }

        chatRoom.members = chatRoom.members.filter(member => member.toString() !== memberId);
        await chatRoom.save();
        return res.status(200).json({
            message: "Member removed from chat room successfully",
            chatRoom
        });
    }
    catch (error) {
        console.error("Error removing member from chat room:", error);
        return res.status(500).json({
            message: "Server error while removing member from chat room"
        });
    }   
}