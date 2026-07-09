import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

import {
  getBalance,
  getTransactions
} from '../controllers/walletController.js'

const router = express.Router()

router.get(
  '/balance',
  authMiddleware,
  getBalance
)

router.get(
  '/transactions',
  authMiddleware,
  getTransactions
)

export default router