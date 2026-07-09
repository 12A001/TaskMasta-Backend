// controllers/taskController.js
import Task from '../models/Task.js'
import TaskProgress from '../models/TaskProgress.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'
import { getYoutubeThumbnail } from '../utils/youtube.js'
import { resetDailyProgress } from '../utils/resetDailyProgress.js'


/**
 * GET /api/tasks
 */
// export const getTasks = async (req, res) => {
//   try {
//     const userPlan = req.user?.plan || 'normal'

//     let allowedTiers = []

//     if (userPlan === 'normal') {
//       allowedTiers = ['low']
//     } else if (userPlan === 'premium') {
//       allowedTiers = ['low', 'medium']
//     } else if (userPlan === 'super') {
//       allowedTiers = ['low', 'medium', 'high']
//     }

//     const completedTaskIds = await TaskProgress.find({
//       userId: req.user._id,
//       rewardClaimed: true
//     }).distinct('taskId')

// const tasks = await Task.find({
//   _id: { $nin: completedTaskIds },
//   active: true,
//   tier: { $in: allowedTiers }
// })

// // 👇 GET TODAY'S COMPLETED TASKS
// const today = new Date().toDateString()

// const todayProgress = await TaskProgress.find({
//   userId: req.user._id,
//   completed: true
// }).populate('taskId')

//     const user = await User.findById(req.user._id)

//     return res.json({
//       success: true,
//       tasks,
//       completedTasks: user.dailyGoalProgress || 0,
//       dailyGoal: 10
//     })

//   } catch (err) {
//     console.error(err)
//     return res.status(500).json({ message: 'Server error' })
//   }
// }

export const getTasks = async (req, res) => {
  try {
    const userPlan = req.user?.plan || 'normal'

    let allowedTiers = []

    if (userPlan === 'normal') {
      allowedTiers = ['low']
    } else if (userPlan === 'premium') {
      allowedTiers = ['low', 'medium']
    } else if (userPlan === 'super') {
      allowedTiers = ['low', 'medium', 'high']
    }

    const completedTaskIds = await TaskProgress.find({
      userId: req.user._id,
      rewardClaimed: true
    }).distinct('taskId')

    const tasks = await Task.find({
      _id: { $nin: completedTaskIds },
      active: true,
      tier: { $in: allowedTiers }
    })

    const today = new Date().toDateString()

    const todayProgress = await TaskProgress.find({
      userId: req.user._id,
      completed: true
    }).populate('taskId')

    // TODAY TASKS (fixed + clean)
    const completedToday = todayProgress
      .filter(p =>
        p.completedAt &&
        new Date(p.completedAt).toDateString() === today
      )
      .map(p => ({
        _id: p.taskId?._id,
        title: p.taskId?.title,
        thumbnail: p.taskId?.thumbnail,
        reward: p.taskId?.reward,
        completedAt: p.completedAt
      }))

const user = await resetDailyProgress(req.user._id)

    return res.json({
      success: true,
      tasks,
      completedTasks: user.dailyGoalProgress || 0,
      dailyGoal: 10,
      completedToday
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/tasks/:id
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * POST /api/tasks
 */
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      youtubeVideoId,
      reward,
      secretCode,
      duration
    } = req.body

    const task = await Task.create({
      title,
      description,
      youtubeVideoId,
      thumbnail: getYoutubeThumbnail(youtubeVideoId),
      reward,
      secretCode,
      duration
    })

    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * POST /api/tasks/start
 */
export const startTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body

    let progress = await TaskProgress.findOne({ taskId, userId })

    if (!progress) {
      progress = await TaskProgress.create({
        taskId,
        userId,
        watchedPercent: 0,
        rewardClaimed: false,
        completed: false
      })
    }

    res.json(progress)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/**
 * POST /api/tasks/verify
 */

export const verifyTask = async (req, res) => {
  try {
    const { taskId, userId, code } = req.body

    if (!taskId || !userId || !code) {
      return res.status(400).json({ message: 'Missing data' })
    }

    const task = await Task.findById(taskId)
    const progress = await TaskProgress.findOne({ taskId, userId })

    if (!task || !progress) {
      return res.status(404).json({ message: 'Task or progress not found' })
    }

    if (progress.completed) {
      return res.status(400).json({ message: 'Task already completed' })
    }

    if (progress.watchedPercent < 95) {
      return res.status(403).json({
        message: 'You must watch at least 95% of the video'
      })
    }

    if (task.secretCode !== code) {
      return res.status(400).json({ message: 'Invalid secret code' })
    }

    const now = new Date()
    const today = now.toDateString()

    const user = await resetDailyProgress(userId)

    //  DAILY LIMIT CONFIG
    const DAILY_GOAL = 10
    const TASK_UNIT = 2

    //  CALCULATE CURRENT PROGRESS SAFELY
    let newDailyGoal = user.dailyGoalProgress || 0


    //  PREVENT OVERFLOW (BLOCK BEFORE UPDATE)
    if (newDailyGoal + TASK_UNIT > DAILY_GOAL) {
      return res.status(400).json({
        success: false,
        message: 'Daily task limit reached. Come back tomorrow.'
      })
    }

    //  SAFE INCREMENT
    newDailyGoal += TASK_UNIT

    //  SINGLE UPDATE ONLY (NO DUPLICATION BUG)
    await User.findByIdAndUpdate(userId, {
      $inc: {
        balance: task.reward,
        totalEarnings: task.reward,
        todayEarnings: task.reward,
        totalTasksCompleted: 1
      },
$set: {
  dailyGoalProgress: newDailyGoal
} 
    })
    const io = req.app.get('io')
io.emit('leaderboard:update')

    // MARK TASK COMPLETED
    await TaskProgress.findOneAndUpdate(
      { taskId, userId },
      {
        rewardClaimed: true,
        codeVerified: true,
        completed: true,
        completedAt: now
      }
    )

    // NOTIFICATION
    await Notification.create({
      userId,
      type: 'task',
      title: 'Task Completed 🎉',
      message: `You earned ${task.reward} coins from "${task.title}"`
    })

    return res.json({
      success: true,
      reward: task.reward,
      dailyGoalProgress: newDailyGoal,
      message: 'Reward claimed successfully'
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: 'Reward verification failed'
    })
  }
}

// export const verifyTask = async (req, res) => {
//   try {
//     const { taskId, userId, code } = req.body

//     if (!taskId || !userId || !code) {
//       return res.status(400).json({ message: 'Missing data' })
//     }

//     const task = await Task.findById(taskId)
//     const progress = await TaskProgress.findOne({ taskId, userId })

//     if (!task || !progress) {
//       return res.status(404).json({ message: 'Task or progress not found' })
//     }

//     if (progress.completed) {
//       return res.status(400).json({ message: 'Task already completed' })
//     }

//     if (progress.watchedPercent < 95) {
//       return res.status(403).json({
//         message: 'You must watch at least 95% of the video'
//       })
//     }

//     if (task.secretCode !== code) {
//       return res.status(400).json({ message: 'Invalid secret code' })
//     }

//     const now = new Date()
//     const today = now.toDateString()

//     const user = await User.findById(userId)

//     //  SAFE DAILY RESET CHECK
//     const lastReset = user.lastDailyReset
//       ? new Date(user.lastDailyReset).toDateString()
//       : null

//     const isNewDay = lastReset !== today

//     //  CALCULATE NEW DAILY PROGRESS ONCE
//     let newDailyGoal = user.dailyGoalProgress || 0

//     if (isNewDay) {
//       newDailyGoal = 0
//     }
//     const DAILY_GOAL = 10

// if (newDailyGoal >= DAILY_GOAL) {
//   return res.status(400).json({
//     success: false,
//     message: 'Daily task limit reached. Come back tomorrow.'
//   })
// }

//     newDailyGoal = Math.min(newDailyGoal + 2, 10)

//     //  SINGLE UPDATE ONLY (NO DUPLICATION BUG)
//     await User.findByIdAndUpdate(userId, {
//       $inc: {
//         balance: task.reward,
//         totalEarnings: task.reward,
//         todayEarnings: task.reward,
//         totalTasksCompleted: 1
//       },
//       $set: {
//         dailyGoalProgress: newDailyGoal,
//         lastDailyReset: isNewDay ? now : user.lastDailyReset
//       }
//     })

//     // MARK TASK COMPLETED
//     await TaskProgress.findOneAndUpdate(
//       { taskId, userId },
//       {
//         rewardClaimed: true,
//         codeVerified: true,
//         completed: true,
//         completedAt: now
//       }
//     )

//     // NOTIFICATION
//     await Notification.create({
//       userId,
//       type: 'task',
//       title: 'Task Completed ',
//       message: `You earned ${task.reward} coins from "${task.title}"`
//     })

//     return res.json({
//       success: true,
//       reward: task.reward,
//       dailyGoalProgress: newDailyGoal,
//       message: 'Reward claimed successfully'
//     })

//   } catch (err) {
//     console.error(err)
//     return res.status(500).json({
//       message: 'Reward verification failed'
//     })
//   }
// }