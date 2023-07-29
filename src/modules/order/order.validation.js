import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'




export const createOrder = joi.object({
    address :joi.string(),
    phone :joi.number().integer().positive().min(1).required(),
    note:joi.string().max(500),
    couponName :joi.string(),
    products :joi.array(),
    paymentType:joi.string()



})

export const cancelOrder = joi.object ({
    orderId : generalFields.id, 
    reason : joi.string().min(1).required(),

})

export const adminUpdateOrder = joi.object ({
    orderId : generalFields.id, 
    status : joi.string().valid('onWay' ,'delivered').required(),

})