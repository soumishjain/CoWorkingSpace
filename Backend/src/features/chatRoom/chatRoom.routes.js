import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware'
import { validateDepartment } from '../../middleware/validateDepartment.middleware'
import { createChatRoom } from './chatRoom.controllers'

const chatRoomRouter = express.Router()

chatRoomRouter.post('/create-chatroom/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,createChatRoom)

chatRoomRouter.delete('/delete-chatroom/:workspaceId/:departmentId/:chatRoomId',identifyUser,validateWorkspace,validateDepartment,deleteChatRoom)

chatRoomRouter.get('/get-chatroom/:workspaceId/:departmentId/:chatRoomId',identifyUser,validateWorkspace,validateDepartment,chatRoomById)  

chatRoomRouter.get('/get-chatrooms/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getChatRooms)

chatRoomRouter.patch('/add-members/:workspaceId/:departmentId/:chatRoomId',identifyUser,validateWorkspace,validateDepartment,addMembersToChatRoom)

chatRoomRouter.patch('/remove-members/:workspaceId/:departmentId/:chatRoomId',identifyUser,validateWorkspace,validateDepartment,removeMembersFromChatRoom)

export default chatRoomRouter