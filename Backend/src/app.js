import 'dotenv/config'
import express from 'express'
import connectToDb from './config/database.js'
import authRouter from './features/auth/auth.routes.js'
import cookieParser from 'cookie-parser'
import worskpaceRouter from './features/workspace/workspace.routes.js'

const app = express()

connectToDb()

app.use(express.json())
app.use(cookieParser());

app.use('/api/auth',authRouter)
app.use('/api/workspace',worskpaceRouter)

export default  app
