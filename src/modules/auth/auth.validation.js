
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const  signUp = joi.object({
    userName:generalFields.userName,
    email :generalFields.email,
    password :generalFields.password,
    cPassword :generalFields.cPassword.valid(joi.ref('password')),
        
    // userName :joi.string().min(2).max(20).required(),
    // email: joi.string().email({
    //     minDomainSegments: 2,
    //     maxDomainSegments: 4,
    //     tlds: { allow: ['com', 'net',] }
    // }).required(),    

    // password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    // cPassword: joi.string().required(),


}).required()


export const  login = joi.object({
    email :generalFields.email,
    password :generalFields.password,
    


}).required()


export const  sendCode = joi.object({    
    email :generalFields.email,



}).required()


export const  newPassword = joi.object({
    code :joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),
    email :generalFields.email,
    password :generalFields.password,
    cPassword :generalFields.cPassword.valid(joi.ref('password')),

}).required()



export const token =joi.object({ token :joi.string().required()}).required()
