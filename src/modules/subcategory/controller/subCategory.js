import subCategoryModel from "../../../../DB/model/subCategory.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js"
import categoryModel from "../../../../DB/model/Category.model.js"
import { nanoid } from "nanoid"


export const getAllCategories = asyncHandler(async (req, res, next) => {
    const subCategory = await subCategoryModel.find({})

    return res.status(200).json({ msg: 'done', subCategory })

})


export const getsubCategory = asyncHandler(async (req, res, next) => {
    const subCategory = await subCategoryModel.findById(req.params.subCategoryId)

    if (!subCategory) {
        return next(new Error('subCategory not found', { cause: 404 }))
    }
    return res.status(500).json({ msg: 'done', subCategory })


})


export const createSubCategory = asyncHandler(async (req, res, next) => {

    const { categoryId } = req.params;
    const { name } = req.body

    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new Error('category not found', { cause: 404 }))

    }
    
    if (await subCategoryModel.findOne({ name: name.toLowerCase() })) {
        return next(new Error('Dublicated subcategory name', { cause: 404 }))
        
    }

    const customId = nanoid()
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/subCategory/${categoryId}/${customId}` })
  
    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name, {
            replacement: '_',
            lower: true,
            trim: true
        }),
        image: { public_id, secure_url },
        categoryId,
        customId,
        createdBy: req.user._id

    })

    if (!subCategory) {

        return next(new Error('fail to create your subCategory', { cause: 400 }))
    }

    return res.status(201).json({ msg: 'done', subCategory })


})

export const updateSubCategory = asyncHandler(async (req, res, next) => {
// بيقولي ان ال كاستوم اي دي لازم يتحط و انا مش محتاجاه هنا و ف نفس الوقت عاملاله ريكوايرد في المودل
const { subCategoryId, categoryId} = req.params
    const subCategory = await subCategoryModel.findOne({_id:subCategoryId ,categoryId})
    if(!subCategory){
        return next(new Error('in-valid subcategory id', { cause: 400 }))

    }

    if (req.body.name) {
        req.body.name =  req.body.name.toLowerCase()
        
        if (req.body.name == subCategory.name) {
            return next(new Error('The old name equal the new name', { cause: 409 }))

        }

        if (await subCategoryModel.findOne({ name: req.body.name })) {
            return next(new Error('Dublicated subCategory name', { cause: 409 }))

        }

        subCategory.name = req.body.name,
            subCategory.slug = slugify(req.body.name, '-')
    }

    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/subCategory` })
        await cloudinary.uploader.destroy(subCategory.image.public_id)
        subCategory.image = { public_id, secure_url }
    }

    await subCategory.save()
    if (!subCategory) {
        return next(new Error('subCategory not found', { cause: 404 }))

    }
    return res.status(201).json({ msg: 'done', subCategory })


})                
