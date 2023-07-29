

export const asyncHandler =(fn) => {
    return (req,res,next) =>{
        fn(req , res , next).catch(err => {
           return next(new Error (err, { cause :500}))
        })

    }
}



export const  globalErrorHandlig = (err , req , res , next )=>{
    if(err){
        if(process.env.MOOD == 'DEV'){
            return res.status(err.cause||500).json({errMsg: err.message ,  errStack : err.stack})
        }
        return res.status(err.cause || 500).json({msg:err.message})

    }
}