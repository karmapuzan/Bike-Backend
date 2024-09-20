import { User } from "../models/user.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken'




// const authjwt = AsyncHandler(async(req, res, next)=>{

//    try {
//      const token = await req.cookies?.accessToken
     
//      if(!token){
//          return next(new ApiError(400,"user not logged in"))
//      }
 
//      const decode = await jwt.verify(token, process.env.ACCESS_TOKEN)
//      if(!decode){
//          throw new ApiError(400, "doesnot verify jwt token cookie")
//      }
 
//      const user  = await User.findById(decode._id)
//      if(!user){
//          throw new ApiError(400, "user is not available")
//      }
 
//      req.user = user
//      next()
//    } catch (error) {
//     console.log("error in authjwt ", error)
    
//    }
// })

const authjwt = AsyncHandler(async(req, res,next)=>{

    const authheader = req.headers.authorization
    console.log("authheare", authheader)
    if(!authheader || !authheader.startsWith('Bearer ')){
        throw new ApiError(400, "user not logged in")
    }
    const token = authheader.split(" ")[1];

    console.log("token", token)

    try{
        const decodeToken = await jwt.verify(token, process.env.ACCESS_TOKEN)
        console.log("decoded token", decodeToken)
        if(!decodeToken){
            throw new ApiError(400, "error in decoding")
        }
        const user = await User.findById(decodeToken._id)

        console.log("user haha", user)
        req.user = user
        next()

    }
    catch(error){

        throw new ApiError(400, "error in auth middleware")

    }
})




export {authjwt}