import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['task',    'task_reward','daily_goal','streak',  'transfer', 'upgrade', 'system','referral'], required: true },
  title: String,
  message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema)