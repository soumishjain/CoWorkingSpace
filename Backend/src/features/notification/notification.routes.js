import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { getMyNotification, getMyRequests, getUnreadNotificationCount, markAllNotificationAsRead, markNotification } from './notification.controllers.js'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware.js'

const notificationRouter = express.Router()

notificationRouter.get('/',identifyUser,getMyNotification)
notificationRouter.patch('/:notificationId',identifyUser,markNotification)
notificationRouter.get('/unread-count',identifyUser,getUnreadNotificationCount)
notificationRouter.patch('/mark-all-read',identifyUser,markAllNotificationAsRead)
notificationRouter.get('/requests/:workspaceId',identifyUser,validateWorkspace,getMyRequests)

export default notificationRouter