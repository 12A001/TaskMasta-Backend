import mongoose from 'mongoose'

const taskProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },

    watchedPercent: {
      type: Number,
      default: 0
    },

    codeVerified: {
      type: Boolean,
      default: false
    },

    rewardClaimed: {
      type: Boolean,
      default: false
    },

    completed: {
      type: Boolean,
      default: false
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

taskProgressSchema.index(
  {
    userId: 1,
    taskId: 1
  },
  {
    unique: true
  }
)

export default mongoose.model(
  'TaskProgress',
  taskProgressSchema
)