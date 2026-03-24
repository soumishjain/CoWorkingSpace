import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { getOldMessage } from './chat.controllers.js'

const chatRouter = express.Router()

chatRouter.get('/old-messages/:departmentId',identifyUser,getOldMessage)

export default chatRouter