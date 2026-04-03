import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { deleteMessage, getMessages } from './chat.controllers.js'

const chatRouter = express.Router()

chatRouter.get("/:chatRoomId/messages", identifyUser, getMessages)
chatRouter.delete("/message/:messageId", identifyUser, deleteMessage)

export default chatRouter