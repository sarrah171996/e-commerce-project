import productModel from "../../../../DB/model/product.model.js"
import cartModel from "../../../../DB/model/cart.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"



export const addTocart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body
    const product = await productModel.findOne({ _id: productId })

    if (!product) {
        return next(new Error('in-valid productId', { cause: 400 }))

    }


    if (quantity > product.stock || product.isDeleted) {
        await productModel.updateOne({ _id: productId }, { $addToSet: { wishUser: req.user._id } })
        return next(new Error('in-valid quantity', { cause: 400 }))

    }

    //check if cart is exist or not
    const cart = await cartModel.findOne({ createdBy: req.user._id })
    if (!cart) {
        //create acart for the first time

        const newCart = await cartModel.create({
            createdBy: req.user._id,
            products: [
                { productId, quantity }
            ]
        })
        return res.status(201).json({ msg: 'Done', newCart })
    }

    let matchProduct = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId.toString() == productId) {
            cart.products[i].quantity = quantity
            matchProduct = true

            break

        }

    }

    if(!matchProduct){
        cart.products.push( {productId, quantity } )
    }

    await cart.save()
    return res.status(201).json({ msg: 'Done', cart })


})


export async function emptyCart (userId){
    await cartModel.updateOne({userId}, {  products : [] }   )

}



export const clearCart = asyncHandler(async (req, res , next )=>{
//    await cartModel.updateOne({createdBy : req.user._id} , {products : []})
const cart = await emptyCart(req.user._id)
    return res.status(201).json({ msg: 'Done' })


})


export async function deleteItemsFromCart (productIds,userId){
    await cartModel.updateOne({userId},
        {
            $pull: {
                products: {
                    productId: {
                        $in: productIds
                    }
                }
            }
        }

    )

}


export const deleteItems = async(req, res , next)=>{
    const {productIds} = req.body

try {
    const cart = await deleteItemsFromCart(productIds , req.user._id)
    return res.status(200).json({msg:'Done' , cart})
 
 
} catch (error) {
    return res.status(200).json({msg:'error' , error: error.stack})
    
}

}