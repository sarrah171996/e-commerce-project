import { Router } from "express";
import * as subCategoryController from './controller/subCategory.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './subCategory.validation.js'
import auth from "../../middleware/auth.js";
import { endPoints } from "./subcategory.endPoint.js";



const router = Router({ mergeParams: true })



router.get('/', subCategoryController.getAllCategories)
router.get('/:subCategoryId', subCategoryController.getsubCategory)

router.post('/',
    auth(endPoints.create),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createSubCategory),
    subCategoryController.createSubCategory
)

router.put('/:subCategoryId',
    auth(endPoints.update),

    fileUpload(fileValidation.image).array('image'),
    // validation(validators.updatesubCategory),        في هنا مشكلة !!!! 

    subCategoryController.updateSubCategory
)






export default router