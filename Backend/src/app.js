import 'dotenv/config'
import express from 'express'
import connectToDb from './config/database.js'
import authRouter from './features/auth/auth.routes.js'
import cookieParser from 'cookie-parser'

const app = express()

connectToDb()

app.use(express.json())
app.use(cookieParser());

app.use('/api/auth',authRouter)

export default  app
