import express from 'express'
import {
  getTasks,
  getTaskById,
  createTask,
  startTask,
  verifyTask
} from '../controllers/taskController.js'
import { updateProgress } from '../controllers/taskProgressController.js'
import authMiddleware from '../middleware/authMiddleware.js'



const router = express.Router()

//  Get all tasks (frontend taskpage)
router.get('/', authMiddleware, getTasks)

//  Get single task (task details page)
router.get('/:id',authMiddleware, getTaskById)

//  Admin creates task (YouTube upload)
router.post('/', authMiddleware, createTask)

//  User starts a task
router.post('/start', authMiddleware, startTask)

//  Track video watch progress
router.post('/progress', authMiddleware, updateProgress)

//  Final verification (code + 95% watch)
router.post('/verify', authMiddleware, verifyTask)

export default router