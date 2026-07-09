import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    plan:{
        type:String,
        enum:['normal','premium','super'],
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    currency:{
        type:String,
        default:'USDT'
    },

    invoiceId:String,

    paymentAddress:String,

    paymentUrl:String,

    status:{
        type:String,
        enum:[
            'pending',
            'paid',
            'expired',
            'failed'
        ],
        default:'pending'
    }

},
{timestamps:true})

export default mongoose.model('Payment',paymentSchema)