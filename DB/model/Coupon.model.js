import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema({
    name: { type: String, required: true   , unique : true},
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', require: false },// to be converted to true
    usedBy: { type: Types.ObjectId, ref: 'User' },
    amount : {type :Number , default : 1 ,required : true} , 
    expire : {type : Date , required : true},
    isDleated: { type: Boolean, default: false }

},
    {
        timestamps: true
    })



const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema)
export default couponModel