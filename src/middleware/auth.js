import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";



export const roles = {
    Admin : 'Admin',
    User : 'User',
    HR : 'HR'
}



const auth = (accessRoles = []) =>{


return asyncHandler( async (req, res, next) => {
    
        const { auth_token } = req.headers;
       
       

        if (!auth_token?.startsWith(process.env.BEARER_KEY)) {
            return res.json({ message: "In-valid bearer key" })
        }
        const token = auth_token.split(process.env.BEARER_KEY)[1]
      
        if (!token) {
            return res.json({ message: "In-valid token" })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
        if (!decoded?.id) {
            return res.json({ message: "In-valid token payload" })
        }
        const authUser = await userModel.findById(decoded.id).select('userName email image role status changePassTime')
        if (!authUser) {
            return res.json({ message: "Not register account" })
        }

        if(parseInt(authUser.changePassTime?.getTime() / 1000) > decoded.iat){
            return next ( new Error ('in valid token , login again'))

        }

        if (authUser.status == 'blocked') {
            return res.json({ message: "blocked account" })
        }
        
        if(!accessRoles.includes(authUser.role)){
            return res.json({ message: "not auth user"  } )
            
        }
        req.user = authUser;
        return next()
    
}

)}
export default auth