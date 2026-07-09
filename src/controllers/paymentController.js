import User from '../models/User.js'
import stripe from '../config/stripe.js'
import Notification from '../models/Notification.js'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const initializePayment = async (req, res) => {
  try {
    const { plan } = req.body

    const prices = {
      normal: 2500, 
      premium: 5000,
      super: 10000
    }

    const amount = prices[plan]

    if (!amount) {
      return res.status(400).json({
        message: 'Invalid plan'
      })
    }


    return res.json({
      success: true,
      url: session.url
    })

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Payment initialization failed'
    })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params

    const session =
      await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        message: 'Payment not completed'
      })
    }

    const userId = session.metadata.userId
    const plan = session.metadata.plan

    const user = await User.findByIdAndUpdate(
      userId,
      { plan },
      { new: true }
    )
    
console.log('CREATING NOTIFICATION...')

const notification = await Notification.create({
  userId,
  type: 'upgrade',
  title: 'Upgrade Successful ',
  message: `Your account has been upgraded to ${plan}`
})

// console.log('NOTIFICATION CREATED:', notification._id)

// Socket notification
const io = req.app.get('io')

if (io) {
  io.to(userId.toString()).emit('notification:new', notification)
  console.log('SOCKET EMITTED TO:', userId)
}
    return res.json({
      success: true,
      message: `Successfully upgraded to ${plan}`,
      user
    })

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Payment verification failed'
    })
  }
}