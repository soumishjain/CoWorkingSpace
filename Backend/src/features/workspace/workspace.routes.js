import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { approveJoinRequest, createWorkspace, deleteWorkspace, getAllWorkspace, getWorkspace, joinWorkspace, rejectJoinRequest, updateWorkspace } from './workspace.controllers.js'

const worskpaceRouter = express.Router()

worskpaceRouter.post('/create',identifyUser , createWorkspace)
worskpaceRouter.get('/get-all-workspace',identifyUser , getAllWorkspace)
worskpaceRouter.get('/get-workspace/:workspaceId',identifyUser , getWorkspace)
worskpaceRouter.post('/delete/:workspaceId',identifyUser , deleteWorkspace)
worskpaceRouter.post('/update/:workspaceId',identifyUser , updateWorkspace)
worskpaceRouter.post('/join-request/:workspaceId',identifyUser , joinWorkspace)
worskpaceRouter.post('/join-request/approve/:reqId',identifyUser , approveJoinRequest)
worskpaceRouter.post('/join-request/reject/:reqId',identifyUser , rejectJoinRequest)


export default worskpaceRouter