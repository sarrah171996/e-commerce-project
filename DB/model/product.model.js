import mongoose, { Schema, Types, model } from "mongoose";

const productSchema = new Schema ({
    name : {type :String , required : true},
    slug : {type :String , required : true},
    description : {type :String },
    stock : {type : Number , required : true , default : 1},
    price : {type : Number , required : true , default : 1},
    finalPrice : {type : Number , required : true , default : 1},
    discount : {type : Number ,  default :0 },
    color : [String],
    size : {
        type : [String],
        enum : ['s' , 'm' , 'l' , 'xl']
    },
    image :{type: Object , required : true},
    subImages :{type: [Object] },
    CategoryId : {type: Types.ObjectId , ref:'Category' , require: false} ,
    subCategoryId : {type: Types.ObjectId , ref:'SubCategory' , require: false} ,
    brandId : {type: Types.ObjectId , ref:'Brand' , require: false} ,
    createdBy : {type: Types.ObjectId , ref:'User' , require: false} ,// to be converted to true
    updatedBy : {type: Types.ObjectId , ref:'User' } ,
    isDleated :{type:Boolean , default : false},
    wishUser : {type: Types.ObjectId , ref:'User' } ,

    

},
{
    toJSON: {virtuals : true} ,
    toObject: {virtuals : true},
    timestamps: true
})


productSchema.virtual('review',{
    localField : '_id',
    foreignField : 'productId',
    ref : 'Review',
})

const productModel = mongoose.models.Product || model('Product',productSchema)
export default productModel