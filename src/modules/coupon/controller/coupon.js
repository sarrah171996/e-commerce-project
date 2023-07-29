import couponModel from "../../../../DB/model/Coupon.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import slugify from 'slugify'
import { asyncHandler } from "../../../utils/errorHandling.js"


export const getAllCoupons = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.find({ isDeleted: false })
    return res.status(200).json({ msg: 'done', coupon })

})


export const getCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.couponId)

    if (!coupon) {
        return next(new Error('coupon not found', { cause: 404 }))
    }
    return res.status(500).json({ msg: 'done', coupon })


})


export const createCoupon = asyncHandler(async (req, res, next) => {

    const name = req.body.name.toLowerCase()
    if (await couponModel.findOne({ name })) {
        return next(new Error('Duplicated coupon name', { cause: 409 }))

    }


    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
       
        req.body.image = { public_id, secure_url }
    }
    const coupon = await couponModel.create(req.body)

    if (!coupon) {

        return next(new Error('fail to create your coupon', { cause: 400 }))
    }
    return res.status(201).json({ msg: 'done', coupon })


})

export const updateCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.couponId)

    if (!coupon) {
        return next(new Error('coupon not found', { cause: 404 }))

    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (coupon.name === req.body.name) {
            return next(new Error('cant update coupon  with the same old name', { cause: 400 }))

        }
        if (await couponModel.findOne({ name: req.body.name })) {

            return next(new Error('Duplicated coupon name', { cause: 409 }))
        }
    }

    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
        if (coupon.image?.public_id) {

            await cloudinary.uploader.destroy(coupon.image?.public_id)
        }
        req.body.image = { public_id, secure_url }
    }
    req.body.updatedBy =req.user._id
    await couponModel.updateOne({_id:req.params.couponId} , req.body)
    return res.status(201).json({ msg: 'done', coupon })


})