import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: Object, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', require: false },// to be converted to true
    updatedBy: { type: Types.ObjectId, ref: 'User'},

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    })


categorySchema.virtual('subCategory',
    {
        localField: "_id",
        foreignField:'categoryId',
        ref:'SubCategory'

    }
)

const categoryModel = mongoose.models.Category || model('Category', categorySchema)
export default categoryModel