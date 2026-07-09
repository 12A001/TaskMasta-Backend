import express from 'express'
import {
  registerUser,
  loginUser,
  getProfile,
  updatePlan,
  updateProfile,
  changePassword,
  getReferrals,
  logoutAllDevices
} from '../controllers/authController.js'

import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/profile', authMiddleware, getProfile)
router.put('/profile', authMiddleware, updateProfile)
router.patch('/plan', authMiddleware, updatePlan)

router.patch('/change-password', authMiddleware, changePassword)


router.get('/referrals', authMiddleware, getReferrals)

router.post('/logout-all', authMiddleware, logoutAllDevices)


export default router