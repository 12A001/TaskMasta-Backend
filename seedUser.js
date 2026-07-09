import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './src/models/User.js'

await mongoose.connect(process.env.MONGO_URI)

const hashedPassword = await bcrypt.hash('123456', 10)

await User.create({
  name: 'Test User',
  email: 'test@gmail.com',
  password: hashedPassword
})

console.log('User created')

process.exit()