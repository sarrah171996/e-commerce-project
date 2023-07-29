import { Router } from "express";
import * as brandController from './controller/brand.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './brand.validation.js'

const router = Router()


router.get('/' , brandController.getAllPrands)
router.get('/:brandId' , brandController.getBrand)

router.post('/',
fileUpload(fileValidation.image).single('image'),
validation(validators.createBrand),
brandController.createBrand
)

router.put('/:brandId',
fileUpload(fileValidation.image).array('image'),
// validation(validators.updatebrand),        في هنا مشكلة !!!! 

brandController.updateBrand
)






export default router