import express from 'express'
import { identifyUser } from '../../middleware/auth.middleware.js'
import { validateWorkspace } from '../../middleware/validateWorkspace.middleware.js'
import { validateDepartment } from '../../middleware/validateDepartment.middleware.js'
import { getDepartmentLeaderBoard, getLeaderboardStats, getMyPosition, getMyRank, getPreviousMonthWinner, getTopPerformers } from './leaderboard.controllers.js'

const leaderboardRouter = express.Router()

leaderboardRouter.get('/department-leaderboard/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getDepartmentLeaderBoard)

leaderboardRouter.get('/my-rank/:workspaceId/:departmentId',identifyUser , validateWorkspace , validateDepartment , getMyRank)

leaderboardRouter.get('/leaderboard-stats/:wrokspaceId/:departmentId', identifyUser , validateWorkspace,validateDepartment , getLeaderboardStats)

leaderboardRouter.get('/top-3/:workspaceId/:departmentId', identifyUser ,validateWorkspace, validateDepartment,getTopPerformers)

leaderboardRouter.get('/leaderboard/my-position/:workspaceId/:departmentId',identifyUser,validateWorkspace,validateDepartment,getMyPosition)

leaderboardRouter.get(
  "/previous-winner/:workspaceId/:departmentId",
  identifyUser,
  validateWorkspace,
  validateDepartment,
  getPreviousMonthWinner
);

export default leaderboardRouter