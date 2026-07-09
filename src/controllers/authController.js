import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import Notification from '../models/Notification.js'

/**
 * =========================
 * SAFE VALIDATION HELPERS
 * =========================
 */
const isValidPassword = (password) => {
  return typeof password === 'string' && password.trim().length === 8
}

const isValidEmail = (email) => {
  return typeof email === 'string' && email.includes('@')
}

/**
 * Generate referral code
 */
const generateReferralCode = (name) => {
  return (
    name.slice(0, 4).toUpperCase() +
    Math.floor(10000 + Math.random() * 90000)
  )
}

/**
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, referral } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    //  STRICT VALIDATION (ADDED)
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be exactly 8 characters'
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    /**
     * FIND REFERRER (if referral code exists)
     */
    let referrer = null

    if (referral) {
      referrer = await User.findOne({ referralCode: referral })
    }

    /**
     * CREATE USER
     */
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: generateReferralCode(name),
      referredBy: referrer ? referrer._id : null
    })

    /**
     * GIVE REFERRAL REWARD
     */
    if (referrer) {
      await User.findByIdAndUpdate(referrer._id, {
        $inc: {
          balance: 20,
          referralEarnings: 20,
          totalEarnings: 20
        }
      })

      try {
        await Notification.create({
          userId: referrer._id,
          type: 'referral',
          title: 'New Referral 🎉',
          message: `${name} joined using your link (+20 coins)`
        })
      } catch (error) {
        console.error('Referral notification failed:', error.message)
      }
    }

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        plan: user.plan,
        totalEarnings: user.totalEarnings,
        todayEarnings: user.todayEarnings,
        currentStreak: user.currentStreak,
        totalTasksCompleted: user.totalTasksCompleted,
        referralCode: user.referralCode
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    //  STRICT VALIDATION (ADDED)
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be exactly 8 characters'
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Invalid credentials format'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        plan: user.plan,
        totalEarnings: user.totalEarnings,
        todayEarnings: user.todayEarnings,
        currentStreak: user.currentStreak,
        totalTasksCompleted: user.totalTasksCompleted,
        referralCode: user.referralCode
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/auth/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Server error'
    })
  }
}

export const getReferrals = async (req, res) => {
  try {
    const userId = req.user.id

    const referrals = await User.find({
      referredBy: userId
    }).select('name createdAt')

    const totalReferrals = referrals.length
    const totalEarned = totalReferrals * 20

    res.json({
      referrals,
      totalReferrals,
      totalEarned
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * PATCH /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        email: req.body.email
      },
      { new: true }
    )

    res.json({
      user: updatedUser
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' })
  }
}

/**
 * PATCH /api/auth/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    //  STRICT 8-CHAR RULE (UPDATED)
    if (
      !isValidPassword(currentPassword) ||
      !isValidPassword(newPassword)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Password must be exactly 8 characters'
      })
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    const salt = await bcrypt.genSalt(10)

    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    return res.json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Failed to update password'
    })
  }
}

/**
 * PATCH /api/auth/plan
 */
export const updatePlan = async (req, res) => {
  try {
    const { plan } = req.body
    const userId = req.user.id

    const user = await User.findByIdAndUpdate(
      userId,
      { plan },
      { new: true }
    ).select('-password')

    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
export const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.user.id

    await User.findByIdAndUpdate(userId, {
      tokenVersion: Date.now()
    })

    return res.json({
      success: true,
      message: 'Logged out from all devices'
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to logout all devices'
    })
  }
}