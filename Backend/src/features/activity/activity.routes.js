import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware.js'
import { validateDepartment } from '../../middleware/validateDepartment.middleware.js'
import { getDepartmentActivities } from './activity.controllers.js'

const activityRouter = express.Router()

activityRouter.get('/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getDepartmentActivities)

export default activityRouter