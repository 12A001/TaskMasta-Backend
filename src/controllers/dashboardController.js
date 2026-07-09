import User from '../models/User.js'

export const getDashboard = async (req, res) => {
  try {
    const user = req.user //  now available

    return res.json({
      user: {
        name: user.name,
        email: user.email,
        balance: user.balance,
        currentStreak: user.currentStreak,
        totalTasksCompleted: user.totalTasksCompleted
      },
      referralMessages: []
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}