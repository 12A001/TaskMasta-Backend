import User from '../models/User.js'

/**
 * GET /api/user/stats
 * Private
 */
export const getUserStats = async (req, res) => {
    if (!req.user) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
  try {
    const user = await User.findById(req.user._id)
      .select('balance dailyGoalProgress currentStreak totalTasksCompleted weeklyTaskHistory')
      .lean()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      balance: user.balance,
      dailyGoalProgress: user.dailyGoalProgress,
      currentStreak: user.currentStreak,
      totalTasksCompleted: user.totalTasksCompleted,
      weeklyTaskHistory: user.weeklyTaskHistory
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/user/profile
 * Private
 */
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select('-password')
//       .lean()

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       user
//     })
//   } catch (error) {
//     console.error('getProfile error:', error)

//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     })
//   }
// }