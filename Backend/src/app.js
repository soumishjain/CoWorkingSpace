import 'dotenv/config'
import express from 'express'
import connectToDb from './config/database.js'

const app = express()

connectToDb()

export default  app
