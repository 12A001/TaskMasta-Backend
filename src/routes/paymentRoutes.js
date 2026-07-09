import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

import {
  initializePayment,
  verifyPayment,
} from '../controllers/paymentController.js'

const router = express.Router()

router.post(
  '/initialize',
  authMiddleware,
  initializePayment
)

router.get(
  '/verify/:sessionId',
  authMiddleware,
  verifyPayment
)

export default router