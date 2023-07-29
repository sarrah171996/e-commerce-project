import userModel from "../../../../DB/model/User.model.js"
import { generateToken, verifyToken } from '../../../utils/GenerateAndVerifyToken.js'
import sendEmail from '../../../utils/email.js'
import { compare, hash } from '../../../utils/HashAndCompare.js'
import { asyncHandler } from "../../../utils/errorHandling.js"

export const signUp = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body
    // check if email exist or not
    if (await userModel.findOne({ email :email.toLowerCase() })) {
        return next(new Error('email exist', { cause: 409 }))
    }

    //send email  

    const token = generateToken({ payload: { email }, expiresIn: 60 * 5 })
    const refreshToken = generateToken({ payload: { email }, expiresIn: 60 * 60 * 24 * 24 })

    //  const link = `http://localhost:5000/auth/confirmEmail/${token}`
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const rfLink = `http://localhost:5000/auth/NewConfirmEmail/${refreshToken}`

    const html = `<!DOCTYPE html>
     <html>
     <head>
         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
     <style type="text/css">
     body{background-color: #88BDBF;margin: 0px;}
     </style>
     <body style="margin:0px;"> 
     <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
     <tr>
     <td>
     <table border="0" width="100%">
     <tr>
     <td>
     <h1>
         <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
     </h1>
     </td>
     <td>
     <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
     </td>
     </tr>
     </table>
     </td>
     </tr>
     <tr>
     <td>
     <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
     <tr>
     <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
     <img width="50px" height="50px" src="${process.env.logo}">
     </td>
     </tr>
     <tr>
     <td>
     <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
     </td>
     </tr>
     <tr>
     <td>
     <p style="padding:0px 100px;">
     </p>
     </td>
     </tr>
     <tr>
     <td>
     <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
     </td>
     </tr>
     <tr>
     <td>
     <br>
     <br>
     <br>
     <br>
     <br>
     <br>
     <br>
     <br>
     <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new  esmail </a>
     </td>
     </tr>
     </table>
     </td>
     </tr>
     <tr>
     <td>
     <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
     <tr>
     <td>
     <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
     </td>
     </tr>
     <tr>
     <td>
     <div style="margin-top:20px;">
 
     <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
     <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
     
     <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
     <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
     </a>
     
     <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
     <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
     </a>
 
     </div>
     </td>
     </tr>
     </table>
     </td>
     </tr>
     </table>
     </body>
     </html>`
    if (!await sendEmail({ to: email, subject: 'Confirmation-Email', html })) {
        return next(new Error('email rejected ', { cause: 400 }))
    }
    //hash password
    const hashPassword = hash({ plaintext: password })
    //create user

    const { _id } = await userModel.create({ userName, email, password: hashPassword })
    return res.status(201).json({ msg: 'Done', _id })

})



export const confirmEmail = asyncHandler(async (req, res, next) => {

    const { token } = req.params;
    const decoded = verifyToken({ token })
    // const {email} = verifyToken({token, signature:process.env.EMAIL_TOKEN})
    // console.log(decoded.email);
    const user = await userModel.updateOne({ email: decoded.email, confirmEmail: false }, { confirmEmail: true })
    return user.matchedCount ? res.status(200).redirect(`${process.env.FE_URL}/#/login`) : next(new Error('invalid token payload'), { case: 400 })


})

export const newConfirmEmail = asyncHandler(async (req, res, next) => {

    const { token } = req.params;
    const { email } = verifyToken({ token })
    if (!email) {
        next(new Error('invalid token payload'))
    }


    const user = await userModel.findOne({ email }, { confirmEmail: true })
    if (!user) {
        next(new Error('not registerd account'), { case: 404 })
    }
    if (user.confirmEmail) {
        res.status(200).redirect(`${process.env.FE_URL}/#/login`)
    }



    const newToken = generateToken({ payload: { email }, expiresIn: 60 * 2 })

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`
    const rfLink = `http://localhost:5000/auth/NewConfirmEmail/${token}`

    const html = `<!DOCTYPE html>
  <html>
  <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
  <style type="text/css">
  body{background-color: #88BDBF;margin: 0px;}
  </style>
  <body style="margin:0px;"> 
  <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
  <tr>
  <td>
  <table border="0" width="100%">
  <tr>
  <td>
  <h1>
      <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
  </h1>
  </td>
  <td>
  <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  <tr>
  <td>
  <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
  <tr>
  <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
  <img width="50px" height="50px" src="${process.env.logo}">
  </td>
  </tr>
  <tr>
  <td>
  <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
  </td>
  </tr>
  <tr>
  <td>
  <p style="padding:0px 100px;">
  </p>
  </td>
  </tr>
  <tr>
  <td>
  <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
  </td>
  </tr>
  <tr>
  <td>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new  esmail </a>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  <tr>
  <td>
  <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
  <tr>
  <td>
  <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
  </td>
  </tr>
  <tr>
  <td>
  <div style="margin-top:20px;">

  <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
  
  <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
  </a>
  
  <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
  <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
  </a>

  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </body>
  </html>`
    if (!await sendEmail({ to: email, subject: 'Confirmation-Email', html })) {
        return next(new Error('email rejected ', { cause: 400 }))
    }
    return res.status(200).send('<p>new cEmail sent to your inpox</p>')
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error('user Not found', { cause: 404 }))
    }

    if (!user.confirmEmail) {
        return next(new Error('please confirm your email firstly', { cause: 400 }))

    }

    const match = compare({ plaintext: password, hashValue: user.password })
    if (!match) {
        return next(new Error('in-valid login data', { cause: 400 }))

    }

    const access_token = generateToken({
        payload: { id: user._id, role: user.role },
        expiresIn: 60 * 30

    })

    const refreshToken = generateToken({
        payload: { id: user._id, role: user.role },
        expiresIn: 60 * 60 * 24 * 365

    })

    user.status = 'online'
    user.save()


    return res.status(200).json({ msg: 'done', access_token, refreshToken })
})

export const sendCode = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const user = await userModel.findOneAndUpdate({ email }, { code })
    if(!user) {
        return next (new Error('user not found' , {cause : 404 }))
    }


    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="${process.env.logo}">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Reset Password</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${code}</p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
   if (!await sendEmail({ to: email, subject: 'forget password', html })) {
       return next(new Error('email rejected ', { cause: 400 }))
   }


    return res.status(200).json({msg : 'Done'})

})


export const newPassword = asyncHandler ( async ( req , res , next )=> {
    const { code , email , password , cPassword} = req.body
    const user = await userModel.findOne({email})
    if(!user){
        return next (new Error('user not found' , {cause : 404 }))

    }
    if (user.code != parseInt(code)){
        return next (new Error('invalid code' , {cause : 400 }))

    }
    if (password != cPassword){
        return next (new Error('password not matched' , {cause : 400 }))

    }
    user.password = hash({plaintext:password})
    user.code = null
    user.changePassTime = Date.now()
    await user.save()
    return res.status(200).json({msg : 'Done'})

})