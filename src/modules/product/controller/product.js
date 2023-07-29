import slugify from "slugify"
import brandModel from "../../../../DB/model/Brand.model.js"
import productModel from "../../../../DB/model/product.model.js"
import subCategoryModel from "../../../../DB/model/subCategory.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import cloudinary from "../../../utils/cloudinary.js"
import { nanoid } from "nanoid"
import userModel from "../../../../DB/model/User.model.js"
import { paginate } from "../../../utils/paginate.js"



export const productsList = asyncHandler(async (req, res, next) => {

    const {skip , limit} = paginate(req.query.page , req.query.size)
    // let {page , size } = req.query
    const products = await productModel.find({}).populate([
        {
            path: "review",

        }
    ]).limit(limit).skip(skip)

    for (let i = 0; i < products.length; i++) {
        let calcRating = 0
        
        if(products.review){

            for (let j = 0; j < products[i].review.length; i++) {
                calcRating += products[i].review[j].rating
    
            } 
            let avgRating = calcRating / products[i].review.length
            const product = products[i].toObject()
            product.avgRating = avgRating
            products[i]= product
        }


    }

    return res.status(200).json({ msg: 'Done', products })
})

export const createProduct = asyncHandler(async (req, res, next) => {
    const { categoryId, subCategoryId, brandId, name, price, discount } = req.body
    if (! await subCategoryModel.findOne({ _id: subCategoryId, categoryId })) {
        return next(new Error('in-valid subCategoryId', { cause: 400 }))
    }

    if (! await brandModel.findOne({ _id: brandId })) {
        return next(new Error('in-valid brandId', { cause: 400 }))
    }

    req.body.slug = slugify(name, {
        replacement: '-',
        trim: true,
        lower: true
    });
    req.body.finalPrice = Number.parseFloat(price - (price * ((discount || 0) / 100))).toFixed(2);

    req.body.customId = nanoid();

    const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.image[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/mainImage` })
    req.body.image = { public_id, secure_url }


    if (req.files?.subImages?.length) {

        req.body.subImages = []

        for (const image of req.files.subImages) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` })

            req.body.subImages.push({ public_id, secure_url })



        }

    }
    req.body.categoryId = req.user._id
    const product = await productModel.create(req.body)

    if (!product) {
        return next(new Error('some thing wrong', { cause: 400 }))

    }
    return res.status(201).json({ msg: 'Done', product })
})


export const updateProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const { categoryId, subCategoryId, brandId, name, price, discount } = req.body

    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error('in-valid productId', { cause: 400 }))

    }
    if (subCategoryId && categoryId) {


        if (! await subCategoryModel.findOne({ _id: subCategoryId, categoryId })) {
            return next(new Error('in-valid subCategoryId', { cause: 400 }))
        }

    }



    if (brandId) {
        if (! await brandModel.findOne({ _id: brandId })) {
            return next(new Error('in-valid brandId', { cause: 400 }))
        }

    }
    if (name) {

        req.body.slug = slugify(name, {
            replacement: '-',
            trim: true,
            lower: true
        });
    }


    if (price && discount) {

        req.body.finalPrice = Number.parseFloat(price - (price * ((discount || 0) / 100))).toFixed(2);
    }

    if (price) {
        req.body.finalPrice = Number.parseFloat(price - (price * ((product.discount || 0) / 100))).toFixed(2);

    }

    if (discount) {
        req.body.finalPrice = Number.parseFloat(product.price - (product.price * ((discount || 0) / 100))).toFixed(2);

    }

    req.body.customId = nanoid();
    if (req.files?.image?.length) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.image[0].path, { folder: `${process.env.APP_NAME}/product/${product.customId}/mainImage` })
        await cloudinary.uploader.destroy(product.image.public_id)
        req.body.image = { public_id, secure_url }
    }

    if (req.files?.subImages?.length) {

        req.body.subImages = []

        for (const image of req.files.subImages) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(image.path, { folder: `${process.env.APP_NAME}/product/${product.customId}/subImages` })

            req.body.subImages.push({ public_id, secure_url })



        }

    }
    req.body.updatedBy = req.user._id;
    await productModel.updateOne({ _id: productId }, req.body)

    return res.status(200).json({ msg: 'Done', product })
})

export const addToWishList = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    if (! await productModel.findById(productId)) {
        return next(new Error('in-valid productId', { cause: 400 }))

    }
    await userModel.updateOne({ _id: req.user._id }, { $addToSet: { wishList: productId } })
    return res.status(200).json({ msg: 'Done' })

})

export const removeFromWishList = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;

    await userModel.updateOne({ _id: req.user._id }, { $pull: { wishList: productId } })
    return res.status(200).json({ msg: 'Done' })

})