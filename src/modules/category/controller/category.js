import categoryModel from "../../../../DB/model/Category.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js"


export const getAllCategories = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.find({}).populate([{
        path:'subCategory'
    }])

    return res.status(200).json({ msg: 'done', category })

})


export const getCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)


    if (!category) {
        return next(new Error('category not found', { cause: 404 }))
    }
    return res.status(500).json({ msg: 'done', category })


})


export const createCategory =async (req, res, next) => {

try {
    

    const { name } = req.body
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })
    const category = await categoryModel.create({
        name,
        slug: slugify(name, '_'),
        image: { public_id, secure_url }
    })

    if (!category) {

        return next(new Error('fail to create your category', { cause: 400 }))
    }
    return res.status(201).json({ msg: 'done', category })

} catch (error) {
    return res.json ({msg : 'error', error: error.message})
    
}
}

export const updateCategory = asyncHandler(async (req, res, next) => {


    const category = await categoryModel.findById(req.params.categoryId)
    if (req.body.name) {
        category.name = req.body.name,
            category.slug = slugify(req.body.name, '_')
    }

     // الصورة مش راضية تتغير
 // و ملف ال ريكويست دوت فايل مش مقري اصلا

    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = { public_id, secure_url }
    }

    await category.save()
    if (!category) {
        return next(new Error('category not found', { cause: 404 }))

    }
    return res.status(201).json({ msg: 'done', category })


})