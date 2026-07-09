// routes/userRoutes.js
import express from "express"
import { getUserStats} from "../controllers/userController.js"
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// IMPORTANT: this becomes /api/user/stats
router.get("/stats",authMiddleware, getUserStats)


export default router