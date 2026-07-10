import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ''
    },

    youtubeVideoId: {
      type: String,
      required: true
    },
    thumbnail: {
  type: String, // Cloudinary URL
  default: null
},

reward: {
  type: Number,
  required: true
},


    secretCode: {
      type: String,
      required: true
    },

duration: {
  type: String,
  default: ''
},
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Task', taskSchema)