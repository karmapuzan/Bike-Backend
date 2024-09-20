import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken'




// const adminjwt = AsyncHandler(async(req, res, next)=>{

//    try {
//      const token = await req.cookies?.accessToken
//      console.log(token)
     
//      if(!token){
//          return next(new ApiError(400,"admin must be logged in"))
//      }
 
//      const decode = await jwt.verify(token, process.env.ACCESS_TOKEN)
//      if(!decode){
//          throw new ApiError(400, "doesnot verify jwt token cookie")
//      }
//      console.log(decode)
 
//      const user  = await Admin.findById(decode._id)
//      if(!user){
//         return next( new ApiError(400, "user is not available"))
//      }
 
//      req.user = user
//      next()
//    } catch (error) {
//     console.log("error in authjwt ", error)
    
//    }
// })

const adminjwt = AsyncHandler(async(req, res, next)=>{

  const authheader = req.headers.authorization
  console.log("auth", authheader)
  

  if(!authheader || !authheader.startsWith('Bearer ')){
    throw new ApiError(400, "admin not logged in")
  }
  const token = authheader.split(" ")[1]
  console.log("token", token)

  try {
    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN )

    console.log("decode", decode)
    if(!decode){
      throw new ApiError(400, "token doesnot match")
    }

    const user = await Admin.findById(decode._id)
    console.log("admin ", user)
    if(!user){
      throw new ApiError(400, "admin not found")
    }

    req.user = user
    next()
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, "Token expired, please log in again");
  }
    console.log("error in admin auth", error)
    throw new ApiError(400, "error in admin authentication")
    
  }


})



export {adminjwt}