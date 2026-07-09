import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      enum: [
        'task_reward',
        'withdrawal',
        'deposit',
        'referral_bonus'
      ],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model(
  'Transaction',
  transactionSchema
)