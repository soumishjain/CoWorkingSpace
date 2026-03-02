import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware'
import { addDepartmentManager, createDepartment } from './department.controllers'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware'
import { validateDepartment } from '../../middleware/validateDepartment.middleware'

const departmentRouter = express.Router()

departmentRouter.post('/create',identifyUser,validateWorkspace,createDepartment)
departmentRouter.post('/assign-manager',identifyUser,validateWorkspace,validateDepartment,addDepartmentManager)

export default departmentRouter