import brandModel from "../../../../DB/model/Brand.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js"


export const getAllPrands = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.find({ isDeleted: false })

    return res.status(200).json({ msg: 'done', brand })

})


export const getBrand = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.findById(req.params.brandId)

    if (!brand) {
        return next(new Error('brand not found', { cause: 404 }))
    }
    return res.status(500).json({ msg: 'done', brand })


})


export const createBrand = asyncHandler(async (req, res, next) => {


    const { name } = req.body

    if (req.body.name) {

        if (await brandModel.findOne({ name: name.toLowerCase() })) {
            return next(new Error('Dublicated brand name', { cause: 409 }))

        }
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` })
    const brand = await brandModel.create({
        name,
        slug: slugify(name, '_'),
        image: { public_id, secure_url }
    })

    if (!brand) {

        return next(new Error('fail to create your brand', { cause: 400 }))
    }
    return res.status(201).json({ msg: 'done', brand })


})

export const updateBrand = asyncHandler(async (req, res, next) => {


    const brand = await brandModel.findById(req.params.brandId)
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == brand.name) {
            return next(new Error('The old name equal the new name', { cause: 409 }))

        }

        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error('Dublicated brand name', { cause: 409 }))

        }
        brand.name = req.body.name,
            brand.slug = slugify(req.body.name, '_')
    }





    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` })
        if (brand.image?.public_id) {

            await cloudinary.uploader.destroy(brand.image.public_id)
        }
        brand.image = { public_id, secure_url }
    }

    await brand.save()
    if (!brand) {
        return next(new Error('brand not found', { cause: 404 }))

    }
    return res.status(201).json({ msg: 'done', brand })


})