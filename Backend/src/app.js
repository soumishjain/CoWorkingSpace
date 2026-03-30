import 'dotenv/config'
import express from 'express'
import connectToDb from './config/database.js'
import authRouter from './features/auth/auth.routes.js'
import cookieParser from 'cookie-parser'
import workspaceRouter from './features/workspace/workspace.routes.js'
import departmentRouter from './features/department/department.routes.js'
import taskRouter from './features/tasks/task.routes.js'
import subtaskRouter from './features/subtasks/subtask.routes.js'
import activityRouter from './features/activity/activity.routes.js'
import notificationRouter from './features/notification/notification.routes.js'
import aiRouter from './features/ai/ai.routes.js'
import { apiLimiter } from './middleware/rateLimit.middleware.js'
import { globalErrorHandler } from './middleware/error.middleware.js'
import cors from 'cors'
import leaderboardRouter from './features/leaderboard/leaderboard.routes.js'
import chatRouter from './features/chat/chat.routes.js'
import paymentRouter from './features/payment/payment.routes.js'
import { startSubscriptionCron } from './cron/subscription.js'
import { leaderboardReset } from './cron/leaderboardReset.js'
const app = express()

connectToDb()

app.set("trust proxy" , 1);

startSubscriptionCron()
leaderboardReset()

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin : process.env.VITE_URL,
    credentials : true
}))


app.get('/' , (req,res) => {
    res.send("Server is Live")
})

app.use('/api',apiLimiter)

app.use('/api/auth',authRouter)
app.use('/api/payment' , paymentRouter)
app.use('/api/workspace',workspaceRouter)
app.use('/api/department',departmentRouter)
app.use('/api/task',taskRouter)
app.use('/api/subtask',subtaskRouter)
app.use('/api/activity',activityRouter)
app.use('/api/notifications',notificationRouter)
app.use('/api/ai',aiRouter)
app.use('/api/leaderboard',leaderboardRouter)
app.use('/api/chat',chatRouter)

app.use(globalErrorHandler)


export default  app
