import { Router } from "express";
import * as productController from './controller/product.js';
import * as validators from './product.validation.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";
import { endPoints } from "./product.endPoint.js";
import { validation } from "../../middleware/validation.js";
import reviewRouter from '../reviews/reviews.router.js'
const router = Router()

router.use('/:productId/review/' , reviewRouter )




router.get('/',productController.productsList)



router.post('/',

auth(endPoints.create),

fileUpload(fileValidation.image).fields([
    {name : 'image' , maxCount : 1},
    {name : 'subImages' , maxCount : 5},
    
]),
validation(validators.createProduct),
productController.createProduct

)



router.put('/:productId',

auth(endPoints.update),

fileUpload(fileValidation.image).fields([
    {name : 'image' , maxCount : 1},
    {name : 'subImages' , maxCount : 5},
    
]),
validation(validators.updateProduct),
productController.updateProduct

)

router.patch("/:productId/wishList",
auth(endPoints.wishList),
validation(validators.wishList),
productController.addToWishList
)

router.patch("/:productId/wishList/remove",
auth(endPoints.wishList),
validation(validators.wishList),
productController.removeFromWishList
)



export default router