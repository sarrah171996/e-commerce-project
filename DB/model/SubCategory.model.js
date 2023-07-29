import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema ({
    name : {type :String , required : true},
    slug : {type :String , required : true},
    image :{type: Object , required : true},
    categoryId : {type: Types.ObjectId , ref:'Category' , require: true} ,
    createdBy : {type: Types.ObjectId , ref:'User' , require: false} ,// to be converted to true
    isDleated :{type:Boolean , default : false},
    customId : {type: String  , required : true}

},
{
    timestamps: true
})


const subCategoryModel = mongoose.models.SubCategory || model('SubCategory',subCategorySchema)
export default subCategoryModel