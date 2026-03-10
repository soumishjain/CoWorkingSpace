import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { getMyNotification, getUnreadNotificationCount, markAllNotificationAsRead, markNotification } from './notification.controllers.js'

const notificationRouter = express.Router()

notificationRouter.get('/',identifyUser,getMyNotification)
notificationRouter.patch('/:notificationId',identifyUser,markNotification)
notificationRouter.get('/unread-count',identifyUser,getUnreadNotificationCount)
notificationRouter.patch('/mark-all-read',identifyUser,markAllNotificationAsRead)

export default notificationRouter