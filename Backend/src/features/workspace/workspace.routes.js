import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { approveJoinRequest, changeMemberRole, createWorkspace, deleteWorkspace, getAllPendingRequestsForWorkspace, getAllWorkspace, getMyWorkspaces, getWorkspace, getWorkspaceMembers, joinWorkspace, leaveWorkspace, rejectJoinRequest, removeMember, updateWorkspace, workspaceStats } from './workspace.controllers.js'

const worskpaceRouter = express.Router()

worskpaceRouter.post('/create',identifyUser , createWorkspace)
worskpaceRouter.get('/get-all-workspace',identifyUser , getAllWorkspace)
worskpaceRouter.get('/get-workspace/:workspaceId',identifyUser , getWorkspace)
worskpaceRouter.post('/delete/:workspaceId',identifyUser , deleteWorkspace)
worskpaceRouter.post('/update/:workspaceId',identifyUser , updateWorkspace)
worskpaceRouter.post('/join-request/:workspaceId',identifyUser , joinWorkspace)
worskpaceRouter.post('/join-request/approve/:reqId',identifyUser , approveJoinRequest)
worskpaceRouter.post('/join-request/reject/:reqId',identifyUser , rejectJoinRequest)
worskpaceRouter.post('/leave/:workspaceId',identifyUser , leaveWorkspace)
worskpaceRouter.get('/get-my-workspaces',identifyUser , getMyWorkspaces)
worskpaceRouter.get('/get-all-requests/:workspaceId',identifyUser , getAllPendingRequestsForWorkspace)
worskpaceRouter.post('/remove/:workspaceId/:removeUserId',identifyUser , removeMember)
worskpaceRouter.post('/change-role/:workspaceId/:targetUserId', identifyUser , changeMemberRole)
worskpaceRouter.get('/get-workspace-members/:workspaceId',identifyUser , getWorkspaceMembers)
worskpaceRouter.get('/stats/:workspaceId',identifyUser , workspaceStats)

export default worskpaceRouter