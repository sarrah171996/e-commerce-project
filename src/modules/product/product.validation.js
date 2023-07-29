import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createProduct = joi.object({
    name :joi.string().min(2).max(50).required(),
    descripyion :joi.string().min(2).max(15000),
    price :joi.number().positive().min(2).required(),
    discount :joi.number().positive().min(1),
    stock :joi.number().integer().positive().min(1).required(),
    color :joi.array(),
    size :joi.array(),
    file :joi.object({
        image : joi.array().items(generalFields.file).length(1).required(),
        subImages : joi.array().items(generalFields.file).max(5),
    }),
    categoryId :generalFields.id,
    createdBy :generalFields.id,
    subCategoryId :generalFields.id,
    brandId :generalFields.id

}).required()

export const updateProduct = joi.object({
    productId :generalFields.id,
    name :joi.string().min(2).max(50),
    descripyion :joi.string().min(2).max(15000),
    price :joi.number().positive().min(2),
    discount :joi.number().positive().min(1),
    stock :joi.number().integer().positive().min(1),
    color :joi.array(),
    size :joi.array(),
    file :joi.object({
        image : joi.array().items(generalFields.file).max(1),
        subImages : joi.array().items(generalFields.file).max(5),
    }),
    categoryId :generalFields.optionalId,
    createdBy :generalFields.optionalId,
    subCategoryId :generalFields.optionalId,
    brandId :generalFields.optionalId

}).required()


export const wishList = joi.object({
    productId:generalFields.id,

}).required()

