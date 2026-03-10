import 'dotenv/config'
import express from 'express'
import connectToDb from './config/database.js'
import authRouter from './features/auth/auth.routes.js'
import cookieParser from 'cookie-parser'
import worskpaceRouter from './features/workspace/workspace.routes.js'
import departmentRouter from './features/department/department.routes.js'
import taskRouter from './features/tasks/task.routes.js'
import subtaskRouter from './features/subtasks/subtask.routes.js'
import activityRouter from './features/activity/activity.routes.js'
import notificationRouter from './features/notification/notification.routes.js'
import "./cron/leaderboardReset.js"

const app = express()

connectToDb()

app.use(express.json())
app.use(cookieParser());

app.use('/api/auth',authRouter)
app.use('/api/workspace',worskpaceRouter)
app.use('/api/department',departmentRouter)
app.use('/api/task',taskRouter)
app.use('/api/subtask',subtaskRouter)
app.use('/api/activity',activityRouter)
app.use('/api/notifications',notificationRouter)

export default  app
