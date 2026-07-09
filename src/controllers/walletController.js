import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

export const getBalance = async (req, res) => {
      console.log('GET BALANCE CONTROLLER HIT')

  try {
    const user = await User.findById(req.user._id)
      .select('balance todayEarnings')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.json({
      balance: user.balance,
      todayEarnings: user.todayEarnings
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
}

export const getTransactions = async (
  req,
  res
) => {
  try {
    const transactions =
      await Transaction.find({
        user: req.user._id
      })
        .sort({ createdAt: -1 })
        .limit(50)

    res.json({
      transactions
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
}