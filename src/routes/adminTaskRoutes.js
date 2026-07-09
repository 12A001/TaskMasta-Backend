import express from 'express'
import Task from '../models/Task.js'
import authMiddleware from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/adminOnly.js'
import { getYoutubeThumbnail } from '../utils/youtube.js'

const router = express.Router()

// CREATE TASK
router.post('/tasks', authMiddleware, adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      youtubeVideoId,
      reward,
      secretCode,
      duration,
      tier,
      active
    } = req.body

    const task = await Task.create({
      title,
      description,
      youtubeVideoId,
      thumbnail: getYoutubeThumbnail(youtubeVideoId),
      reward,
      secretCode,
      duration,
      tier,
      active
    })

    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET ALL TASKS
router.get('/tasks', authMiddleware, adminOnly, async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 })
  res.json(tasks)
})

// UPDATE TASK
router.put('/tasks/:id', authMiddleware, adminOnly, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
  res.json(task)
})

// DELETE TASK
router.delete('/tasks/:id', authMiddleware, adminOnly, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)
  res.json({ message: 'Task deleted' })
})

export default router