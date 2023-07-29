import { Router } from "express";
import * as couponController from './controller/coupon.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './coupon.validation.js'
import auth from "../../middleware/auth.js";
import { endPoints } from "./coupon.endPoint.js";
const router = Router()

router.get('/' , couponController.getAllCoupons)
router.get('/:couponId' , couponController.getCoupon)

router.post('/',
auth(endPoints.create),
fileUpload(fileValidation.image).single('image'),
validation(validators.createCoupon),
couponController.createCoupon
)

router.put('/:couponId',
auth(endPoints.update),
fileUpload(fileValidation.image).single('image'),
// validation(validators.updatecoupon),        في هنا مشكلة !!!! 

couponController.updateCoupon
)






export default router