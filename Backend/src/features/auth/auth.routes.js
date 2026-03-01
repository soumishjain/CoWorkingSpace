import express from 'express'
import { getMe, loginUser, logoutUser, registerUser, verifyEmail } from './auth.controllers.js'
import { identifyUser } from '../../middleware/auth.middleware.js'

const authRouter = express.Router()

authRouter.post('/register',registerUser)
authRouter.post('/login',loginUser)
authRouter.post('/logout',logoutUser)
authRouter.get('/verify-email',verifyEmail)
authRouter.get('/getme' ,identifyUser, getMe)

export default authRouter