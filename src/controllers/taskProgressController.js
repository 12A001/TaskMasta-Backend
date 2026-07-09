import TaskProgress from '../models/TaskProgress.js'
import Task from '../models/Task.js'

export const updateProgress = async (req, res) => {
  try {
    const { taskId, userId, watchedPercent } = req.body

    if (!taskId || !userId) {
      return res.status(400).json({ message: 'Missing data' })
    }

    let progress = await TaskProgress.findOne({ userId, taskId })

    if (!progress) {
      progress = await TaskProgress.create({
        userId,
        taskId,
        watchedPercent: watchedPercent || 0
      })
    } else {
      progress.watchedPercent = Math.max(
        progress.watchedPercent,
        watchedPercent
      )

      await progress.save()
    }

    //  GET TASK FOR SECRET CODE
    const task = await Task.findById(taskId)

    const unlocked = progress.watchedPercent >= 95

    return res.json({
      success: true,
      watchedPercent: progress.watchedPercent,
      unlocked,

      //  THIS IS WHAT YOU WERE MISSING
      secretCode: unlocked ? task.secretCode : null
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Progress update failed' })
  }
}