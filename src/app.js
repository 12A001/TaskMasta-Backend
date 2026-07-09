import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import taskRoutes from './routes/taskRoutes.js'
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import dashboardRoutes from './routes/dashboardRoutes.js'
import walletRoutes from './routes/walletRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import adminTaskRoutes from './routes/adminTaskRoutes.js'
import leaderboardRoutes from './routes/leaderboardRoutes.js'







const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use(express.json())

//  Routes
app.use('/api/tasks', taskRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/admin', adminTaskRoutes)
app.use('/api/leaderboard', leaderboardRoutes)


export default app