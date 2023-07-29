import * as orderController from './controller/order.js'
import auth from "../../middleware/auth.js";
import { endPoints } from "./order.endPoint.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './order.validation.js'
import { Router } from "express";

const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"order Module"})
})


router.post('/' ,
auth(endPoints.create),
validation(validators.createOrder),
orderController.createOrder)



router.patch('/:orderId' ,
auth(endPoints.cancel),
validation(validators.cancelOrder),
orderController.cancelOrder)

router.patch('/:orderId/admin' ,
auth(endPoints.adminUpdateOrder),
validation(validators.adminUpdateOrder),
orderController.updateOrderByAdmin)


export default router