import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { addDepartmentManager, addMemberInDepartment, approveDepartmentJoinRequest, createDepartment, deleteDepartment, departmentStats, getAllDepartmentMembers, getAllDepartmentsOfThisWorkspace, getAllPendingDepartmentRequests, getMyDepartments, getThisDepartment, joinDepartment, leaveDepartment, rejectDepartmentJoinRequest, removeMemberFromDepartment, updateDepartment } from './department.controllers.js'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware.js'
import { validateDepartment } from '../../middleware/validateDepartment.middleware.js'

const departmentRouter = express.Router()

departmentRouter.post('/create/:workspaceId',identifyUser,validateWorkspace,createDepartment)

departmentRouter.post('/assign-manager/:workspaceId/:departmentId/:assignedUserId',identifyUser,validateWorkspace,validateDepartment,addDepartmentManager)

departmentRouter.post('/add-member/:workspaceId/:departmentId/:newUserId',identifyUser,validateWorkspace,validateDepartment,addMemberInDepartment)

departmentRouter.delete('/delete-department/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,deleteDepartment)

departmentRouter.patch('/update-department/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,updateDepartment)

departmentRouter.get('/get-this-department/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getThisDepartment)

departmentRouter.get('/get-my-departments/:workspaceId',identifyUser,validateWorkspace,getMyDepartments)

departmentRouter.post('/leave/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,leaveDepartment)

departmentRouter.post('/join-department/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,joinDepartment)

departmentRouter.post('/join-department/reject/:workspaceId/:departmentId/:reqId',identifyUser,validateWorkspace,validateDepartment,rejectDepartmentJoinRequest)

departmentRouter.post('/join-department/approve/:workspaceId/:departmentId/:reqId',identifyUser,validateWorkspace,validateDepartment,approveDepartmentJoinRequest)

departmentRouter.get('/get-departments-of-this-workspace/:workspaceId',identifyUser,validateWorkspace,getAllDepartmentsOfThisWorkspace)

departmentRouter.get('/get-department-members/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getAllDepartmentMembers)

departmentRouter.post('/remove-member/:workspaceId/:departmentId/:removeUserId',identifyUser,validateWorkspace,validateDepartment,removeMemberFromDepartment)

departmentRouter.get('/get-all-department-pending-requests/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getAllPendingDepartmentRequests)

departmentRouter.get('/department-stats/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,departmentStats)

export default departmentRouter