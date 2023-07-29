import * as cartController from './controller/cart.js';
import auth from "../../middleware/auth.js";
import { endPoints } from "./cart.endPoint.js";
import * as validators from './cart.validation.js'
import { validation } from "../../middleware/validation.js";

import { Router } from "express";





const router = Router()

router.get('/', (req ,res)=>{
    res.status(200).json({message:"Cart Module"})
})



router.post('/',

auth(endPoints.create),

validation(validators.addToCart),
cartController.addTocart

)


router.patch('/deleteItems',

auth(endPoints.create),

validation(validators.deleteItems),
cartController.deleteItems

)


router.patch('/',

auth(endPoints.delete),

cartController.clearCart

)

export default router