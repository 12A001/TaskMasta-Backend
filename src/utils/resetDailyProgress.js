import User from '../models/User.js'

export const resetDailyProgress = async (userId) => {
  const user = await User.findById(userId)
  if (!user) return null

  const today = new Date().toDateString()

  const lastReset = user.lastDailyReset
    ? new Date(user.lastDailyReset).toDateString()
    : null

  const isNewDay = lastReset !== today

  if (isNewDay) {
    user.dailyGoalProgress = 0
        user.todayEarnings = 0          
    user.lastDailyReset = new Date()
    await user.save()
  }

  return user
}