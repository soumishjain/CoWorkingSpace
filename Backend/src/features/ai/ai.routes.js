import express, { Router } from 'express'
import { generateTaskSubtasks } from './ai.controllers.js'

const aiRouter = express.Router()

aiRouter.post('/generate-subtasks',generateTaskSubtasks)

export default aiRouter