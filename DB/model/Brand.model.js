import mongoose, { Schema, Types, model } from "mongoose";

const brandSchema = new Schema ({
    name : {type :String , required : true},
    slug : {type :String , required : true},
    image :{type: Object , required : true},
    createdBy : {type: Types.ObjectId , ref:'User' , require: false} ,// to be converted to true
    isDleated :{type:Boolean , default : false}

},
{
    timestamps: true
})


const brandModel = mongoose.models.Brand || model('Brand',brandSchema)
export default brandModel