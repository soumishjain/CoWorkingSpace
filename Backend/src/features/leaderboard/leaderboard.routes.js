import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware'
import { validateDepartment } from '../../middleware/validateDepartment.middleware'
import { getDepartmentLeaderBoard, getLeaderboardStats, getMyPosition, getMyRank, getTopPerformers } from './leaderboard.controllers'

const leaderboardRouter = express.Router()

leaderboardRouter.get('/department-leaderboard/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getDepartmentLeaderBoard)

leaderboardRouter.get('/my-rank/:workspaceId/:departmentId',identifyUser , validateWorkspace , validateDepartment , getMyRank)

leaderboardRouter.get('/leaderboard-stats/:wrokspaceId/:departmentId', identifyUser , validateWorkspace,validateDepartment , getLeaderboardStats)

leaderboardRouter.get('/top-3/:workspaceId/:departmentId', identifyUser ,validateWorkspace, validateDepartment,getTopPerformers)

leaderboardRouter.get('/leaderboard/my-position/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getMyPosition)


export default leaderboardRouter