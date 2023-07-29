import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const createSubCategory = joi.object({
    categoryId:generalFields.id,

    name :joi.string().min(2).max(50).required(),
    file:generalFields.file.required()
}).required()


export const updateSubCategory = joi.object({
    id:generalFields.id,
    name :joi.string().min(2).max(50).required(),
    file:generalFields.file.required()
}).required()
