import { Router } from "express";
import * as categoryController from './controller/category.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './category.validation.js'
import subCategoryRouter from '../subcategory/subcategory.router.js'
import auth, { roles } from "../../middleware/auth.js";
import { endPoints } from "./category.endPoint.js";
const router = Router()

router.use('/:categoryId/subCategory', subCategoryRouter)

router.get('/:categoryId', categoryController.getCategory)

router.get('/',
    auth(Object.values(roles)), // عشان اخلي اي حد من الرولز اللي عندي يقدر يشوف الكاتيجوريز لكن لو حد اوفلاين مينفعش
   
    categoryController.getAllCategories)



router.post('/',
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createCategory),
    auth(endPoints.create),
    categoryController.createCategory
)

router.put('/:categoryId',
    fileUpload(fileValidation.image).array('image'),
    // validation(validators.updateCategory),        في هنا مشكلة !!!! 
    auth(endPoints.update),

    categoryController.updateCategory
)






export default router