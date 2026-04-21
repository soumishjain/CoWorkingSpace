import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { approveJoinRequest, changeMemberRole, createFreeWorkspace, deleteWorkspace, getAllPendingRequestsForWorkspace, getAllWorkspace, getMyWorkspaces, getWorkspace, getWorkspaceMembers, joinWorkspace, leaveWorkspace, rejectJoinRequest, removeMember, searchWorkspaces, updateWorkspace, workspaceStats } from './workspace.controllers.js'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware.js'
import multer from 'multer'

const upload = multer({storage : multer.memoryStorage()})
const workspaceRouter = express.Router()

workspaceRouter.post('/create-free',upload.single("coverImage"),identifyUser , createFreeWorkspace)
workspaceRouter.get('/get-all-workspace',identifyUser , getAllWorkspace)
workspaceRouter.get('/get-workspace/:workspaceId',identifyUser , validateWorkspace , getWorkspace)
workspaceRouter.post('/delete/:workspaceId',identifyUser, validateWorkspace , deleteWorkspace)
workspaceRouter.post('/update/:workspaceId',identifyUser , validateWorkspace , updateWorkspace)
workspaceRouter.post('/join-request/:workspaceId',identifyUser , joinWorkspace)
workspaceRouter.patch('/join-request/approve/:reqId',identifyUser , approveJoinRequest)
workspaceRouter.patch('/join-request/reject/:reqId',identifyUser , rejectJoinRequest)
workspaceRouter.post('/leave/:workspaceId',identifyUser , validateWorkspace , leaveWorkspace)
workspaceRouter.get('/get-my-workspaces',identifyUser , getMyWorkspaces)
workspaceRouter.get('/get-all-requests/:workspaceId',identifyUser , validateWorkspace , getAllPendingRequestsForWorkspace)
workspaceRouter.post('/remove/:workspaceId/:removeUserId',identifyUser , validateWorkspace ,  removeMember)
workspaceRouter.post('/change-role/:workspaceId/:targetUserId', identifyUser ,validateWorkspace, changeMemberRole)
workspaceRouter.get('/get-workspace-members/:workspaceId',identifyUser ,validateWorkspace, getWorkspaceMembers)
workspaceRouter.get('/stats/:workspaceId',identifyUser , validateWorkspace ,  workspaceStats)
workspaceRouter.get('/search',identifyUser,searchWorkspaces)

export default workspaceRouter