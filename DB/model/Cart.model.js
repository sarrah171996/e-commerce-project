import mongoose, { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({

    createdBy: { type: Types.ObjectId, ref: 'User', require: true },
    products: [{
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, defult: 1 },

    }],
    isDleated: { type: Boolean, default: false },
},
    {
        timestamps: true
    })


const cartModel = mongoose.models.Cart || model('Cart', cartSchema)
export default cartModel