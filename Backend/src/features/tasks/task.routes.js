import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware.js'
import { validateDepartment } from '../../middleware/validateDepartment.middleware.js'
import { approveTask, createTask, deleteTask, getAllTasks, getSingleTask, rejectTask } from './task.controllers.js'
import { validateManager } from '../../middleware/validateManager.js'

const taskRouter = express.Router()

taskRouter.post('/create-task/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,createTask)
taskRouter.delete('/delete-task/:taskId',identifyUser,deleteTask)
taskRouter.get('/task/:taskId',identifyUser,getSingleTask)
taskRouter.get('/all-tasks/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getAllTasks)
taskRouter.patch('/approve-task/:taskId',identifyUser,approveTask)
taskRouter.patch('/reject-task/:taskId',identifyUser,rejectTask)


export default taskRouter