import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware.js'
import { validateDepartment } from '../../middleware/validateDepartment.middleware.js'
import { addMemberToChatRoom, chatRoomById, createChatRoom, deleteChatRoom, getChatRooms, removeMemberFromChatRoom } from './chatRoom.controllers.js'

const chatRoomRouter = express.Router()

chatRoomRouter.post('/create-chatroom/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,createChatRoom)

chatRoomRouter.delete('/delete-chatroom/:workspaceId/:departmentId/:chatRoomId',identifyUser,validateWorkspace,validateDepartment,deleteChatRoom)

chatRoomRouter.get('/get-chatroom/:workspaceId/:departmentId/:chatRoomId',identifyUser,validateWorkspace,validateDepartment,chatRoomById)  

chatRoomRouter.get('/get-chatrooms/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getChatRooms)

chatRoomRouter.patch('/add-members/:workspaceId/:departmentId/:chatRoomId',identifyUser,validateWorkspace,validateDepartment,addMemberToChatRoom)

chatRoomRouter.patch('/remove-members/:workspaceId/:departmentId/:chatRoomId',identifyUser,validateWorkspace,validateDepartment,removeMemberFromChatRoom)

export default chatRoomRouter