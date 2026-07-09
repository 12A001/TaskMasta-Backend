import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import { Server } from 'socket.io'

import app from './app.js'
import connectDB from './config/db.js'

await connectDB()

const PORT = process.env.PORT || 5002

// 1. Create HTTP server (IMPORTANT for socket.io)
const server = http.createServer(app)

// 2. Attach Socket.io to server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
  }
})

// 3. Make io accessible everywhere in backend
app.set('io', io)

// 4. Socket connection logic
io.on('connection', (socket) => {
  console.log(' User connected:', socket.id)

  // user joins their personal room
  socket.on('join', (userId) => {
    socket.join(userId.toString())
    console.log(`User joined room: ${userId}`)

    socket.emit('joined', userId)
  })

  socket.on('disconnect', () => {
    console.log(' User disconnected:', socket.id)
  })
})

// 5. Start server using HTTP server (NOT app.listen anymore)
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`)
})