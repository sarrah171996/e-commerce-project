import orderdModel from "../../../../DB/model/Order.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import productModel from "../../../../DB/model/product.model.js"
import couponModel from "../../../../DB/model/Coupon.model.js"
import orderModel from "../../../../DB/model/Order.model.js"
import cartModel from "../../../../DB/model/cart.model.js"
import { deleteItemsFromCart } from "../../cart/controller/cart.js"
import { createInvoice } from "../../../utils/pdf.js"
// import { createInvoice } from './src/utils/pdf.js'


//#### neet to fix #####   
// شغال كويس بس بعد ما بعمل الاوردر وال كارت تفضى بياخد الوردرات و يحطها في الداتا بيز تاني
// !!يعني كأنه بيفضي الكارت في دوكيومنتيشن لوحده


export const createOrder = asyncHandler(async (req, res, next) => {
    let sumTotal = 0
    let finalProductList = []
    let productIds = []
    const { products, address, phone, couponName, note, paymentType , name } = req.body;



    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } })
        if (!coupon ||
            (parseInt(Date.now() / 1000) > parseInt((coupon?.expire?.getTime() / 1000)))
        ) {
            return next(new Error(`in-valid or expire coupon`, { cause: 400 }))

        }
        req.body.coupon = coupon
    }
    for (const product of products) {
        const checkedProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })

        if (!checkedProduct) {

            return next(new Error(`fail to add thies products ${checkedProduct?.name}`, { cause: 400 }))
        }


        productIds.push(product.productId)
        product.name = checkedProduct.name
        product.unitPrice = checkedProduct.finalPrice;
        product.finalPrice = product.unitPrice * product.quantity.toFixed(2)
        finalProductList.push(product)
        sumTotal += product.finalPrice

    }

    const order = await cartModel.create({
        userId: req.user._id,
        products: finalProductList,
        couponId: req.body.coupon?._id,
        finalPrice: Number.parseFloat(sumTotal - ((sumTotal * (req.body.coupon?.amount || 0) / 100))).toFixed(2),
        address,
        phone,
        note,
        paymentType,
        status: paymentType ? 'waitPayment' : 'placed',
        finalPrice: sumTotal

    })


    if (!order) {
        return next(new Error(`fail to place your order`, { cause: 400 }))

    }


    for (const product of products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })

    }

    if (couponName) {
        await couponModel.updateOne({ _id: req.user._id }, { $addToSet: { usedBy: req.user._id } })
    } else {

        await deleteItemsFromCart(productIds, req.user._id)
    }





    // create pdf 
    // const invoice = {
    //     shipping: {
    //         name: req.user.userName,
    //         address: order.address,
    //         city: "Cairo",
    //         state: "Cairo",
    //         country: "Eg",
    //         postal_code: 94111
    //     },


    //     items: order.products,
    //     subtotal:sumTotal*100,
    //     total:order.finalPrice*100,
    //     invoice_nr: order._id,
    //     date:order.createdAt
    // };
    // await createInvoice(invoice, "invoice.pdf");

    const dummyOrder = {
        userId : req.user._id,
        address,
        phone,
        note ,
        products
    }
    
    // console.log(dummyOrder.products.name);


    return res.status(201).json({ msg: 'Done', dummyOrder })






})

export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { reason, couponName } = req.body;
    const order = await orderModel.findOne({ _id: orderId });
    if (!order) {
        return next(new Error(`fail to cancel your order`, { cause: 400 }))
    }
    if ((order?.status != 'placed' && order.paymentType == 'cash') || (order?.status != 'waitPayment' && order.paymentType == 'card')) {
        return next(new Error(`can't cancel your order after it been changed to ${order.status}`, { cause: 400 }))
    }

    const cancelOrder = await orderModel.updateOne({ _id: orderId }, { status: 'canceled', reason, updatedBy: req.user._id })
    // const cancelOrder = await orderModel.updateOne({ _id: order._id }, { status: 'canceled', reason, updatedBy: req.user._id })

    if (!cancelOrder.matchedCount) {
        return next(new Error(`fail to cancel your order `, { cause: 400 }))

    }

    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } })

    }

    if (couponName) {
        await couponModel.updateOne({ _id: req.user._id }, { $pull: { usedBy: req.user._id } })
    }
    return res.status(201).json({ msg: 'Done' })





})

export const updateOrderByAdmin = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findOne({ _id: orderId });
    if (!order) {
        return next(new Error(`in-valid orderId`, { cause: 404 }))
    }

    const updateOrder = await orderModel.updateOne({ _id: orderId }, { status, updatedBy: req.user._id })

    if (!updateOrder.matchedCount) {
        return next(new Error(`fail to update your order's status `, { cause: 400 }))
    }
    return res.status(201).json({ msg: 'Done' })

})


