import express from 'express'
import { claimSubtask, completeSubtask, getMyPendingSubtasks, getSubtasksOfTasks } from './subtask.controllers'
import { identifyUser } from '../../middleware/auth.middleware'

const subtaskRouter = express.Router()

subtaskRouter.get('/tasks/:taskId/subtask', identifyUser , getSubtasksOfTasks)
subtaskRouter.post('/claim-subtask/:subtaskId', identifyUser , claimSubtask)
subtaskRouter.post('/complete-subtask/:subtaskId', identifyUser , completeSubtask)
subtaskRouter.get('/my-pending-subtask', identifyUser , getMyPendingSubtasks)

export default subtaskRouter