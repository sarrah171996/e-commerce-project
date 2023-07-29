import { Router } from "express";
import * as authController from './controller/registration.js'
import * as validators from './auth.validation.js'
import { validation } from "../../middleware/validation.js";
const router = Router()


router.post('/signUp' , validation(validators.signUp), authController.signUp)
router.post('/login' , validation(validators.login), authController.login)
router.get('/confirmEmail/:token' , validation( validators.token) ,authController.confirmEmail)
router.get('/newConfirmEmail/:token' ,validation( validators.token) ,authController.confirmEmail)
router.patch('/sendCode' ,validation(validators.sendCode) ,authController.sendCode)
router.put('/newPassword' ,validation(validators.newPassword), authController.newPassword)



export default router