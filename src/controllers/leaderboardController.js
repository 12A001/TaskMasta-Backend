import User from '../models/User.js'

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name avatar totalEarnings balance plan')
      .sort({ totalEarnings: -1 }) //  top earners first
      .limit(100)

    const leaderboard = users.map((u, index) => ({
      rank: index + 1,
      _id: u._id,
      name: u.name,
      avatar: u.avatar,
      earnings: u.totalEarnings || 0,
      plan: u.plan,       
    }))

    return res.json({
      success: true,
      leaderboard
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}