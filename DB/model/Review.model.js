import mongoose, { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema ({
    comment : {type :String , required : true},
    rating : {type :Number , required : true , min : 1 , max : 5} ,
    createdBy : {type: Types.ObjectId , ref:'User' , require: true} ,
    productId : {type: Types.ObjectId , ref:'Product' , require: true} ,
    orderId : {type: Types.ObjectId , ref:'Order' , require: true} ,

},
{
    timestamps: true
})


const reviewModel = mongoose.models.Review || model('Review',reviewSchema)
export default reviewModel