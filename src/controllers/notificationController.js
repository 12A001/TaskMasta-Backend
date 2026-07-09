import Notification from '../models/Notification.js'

export const createNotification = async (req, res) => {
  try {
    const io = req.app.get('io')

    const notification = await Notification.create(req.body)

    // send real-time to user room
    io.to(notification.userId.toString()).emit('notification:new', notification)

    res.status(201).json(notification)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(notifications)
}

export const markRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true })
  res.json({ success: true })
}