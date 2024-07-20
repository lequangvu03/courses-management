import express, { json } from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import path from 'path'
import envs from './constants/env-variables'
import adminRouter from './routes/admin.routes'
const PORT = envs.port || 4000
const app = express()

// ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Connect to database
databaseService.connect()

app.use(json())
app.use(cors())

// Routes
app.use('/api/auth', authRouter)
app.use('/api', adminRouter)

// Default error handler middleware
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`)
})
