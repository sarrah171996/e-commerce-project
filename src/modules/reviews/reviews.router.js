import { Router } from "express";
import * as reviewController from './controller/review.js';
import * as validators from './reviews.validation.js'
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoints } from "./reviews.endPoint.js";

const router = Router({mergeParams : true})




router.get('/', (req ,res)=>{
    res.status(200).json({message:"reviews Module"})
})

 
router.post("/" ,
auth(endPoints.createReview),
validation(validators.createReview),
 reviewController.createReview)

 router.put("/:reviewId" ,
auth(endPoints.updateReview),
validation(validators.updateReview),
 reviewController.updateReview)




export default router