import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
},

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

plan: {
  type: String,
  enum: ['free', 'normal', 'premium', 'super'],
  default: 'free'
},

    balance: {
      type: Number,
      default: 0
    },

    totalEarnings: {
      type: Number,
      default: 0
    },

    todayEarnings: {
      type: Number,
      default: 0
    },
    lastEarningsDate: {
  type: String,
  default: null
},

    dailyGoalProgress: {
      type: Number,
      default: 0
    },
    lastDailyReset: {
  type: Date,
  default: Date.now
},

    currentStreak: {
      type: Number,
      default: 0
    },

    lastTaskDate: {
      type: Date,
      default: null
    },

    totalTasksCompleted: {
      type: Number,
      default: 0
    },
referralCode: {
  type: String,
  unique: true,
  sparse: true
},
referredBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null
},

referralEarnings: {
  type: Number,
  default: 0
},

referralPaid: {
  type: Boolean,
  default: false
},
    weeklyTaskHistory: [
      {
        day: String,
        completed: Boolean,
        date: String
      }
    ]
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', userSchema)