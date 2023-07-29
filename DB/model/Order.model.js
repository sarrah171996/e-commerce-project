import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({

    userId: { type: Types.ObjectId, ref: 'User', require: true },
    products: [{
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required:true },
        quantity: { type: Number, defult: 1 },
        unitPrice: { type: Number, default: 1 },
        finalPrice: { type: Number, default: 1 },



    }],
    finalPrice: { type: Number, default: 1 },
    couponId: { type: Types.ObjectId, ref: 'Coupon' },
    phone: [String],
    address: { type: String },
    status: {
        type: String,
        default: 'placed',
        enum: ['waitPayment', 'placed', 'rejected', 'onWay', 'delivered']
    },
    paymentType: {
        type: String,
        default: 'cash',
        enum: ['cash', 'card']
    },
    note: String,
    reason : String,
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    isDleated: { type: Boolean, default: false },

},
    {
        timestamps: true
    })


const orderModel = mongoose.models.Order || model('Order', orderSchema)
export default orderModel