import { Admin } from "../models/admin.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ErrorHandler.js";
import { ApiResponse } from "../utils/ResponseHandler.js";
// import { createApiError } from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken'


const generateAccessRefreshToken = async(userId)=>{

    const user = await Admin.findById(userId)
    if(!user){
        throw new ApiError(400, "user is not available")
    }
    const accessToken = await user.accessTokenGenerator()
    const refreshToken = await user.refreshTokenGenerator()

    user.refreshToken = refreshToken
    user.save({validateBeforeSave:false})
    return {accessToken, refreshToken}
}

const adminlogin = AsyncHandler(async(req, res)=>{

    const body = req.body

    const email = body?.email?.email || body?.email
    const password = body?.email?.password  || body?.password
    
    // console.log("email", email)
    // console.log("password", password)

    if(!email || !password){
        throw new ApiError(400, "pleasse enter email and pasword value")
    }

    const user = await Admin.findOne({email:email})
    if(!user){
        // return next(createApiError(400,"admin doesnot exit"))
        throw new ApiError(400, "admin user doesnot exist")
    }

    const checkpassword = await user.comparepassword(password)
    if(!checkpassword){
        // return next(createApiError(400,"incorrect password"))
        throw new ApiError(400, "incorrect password")
    }

    const {accessToken, refreshToken} = await generateAccessRefreshToken(user._id)

    const options = {
        httpOnly:true,
        secure:true
    }


    return res.status(200)
    // .cookie("accessToken", accessToken, options)
    // .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user: user, accessToken, refreshToken}, "login successs"))
})

const adminlogout = AsyncHandler(async(req, res)=>{

    const users = req.user
    if(!users){
        throw new ApiError(400, "user is not logged in")
    }

    await Admin.findByIdAndUpdate({_id:users._id},{
        $set:{
            refreshToken:undefined
        }
    },{new:true})

    const options = {
        httpOnly:true,
        secure:true
    }


    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "logout succes"))
})

const createRefreshToken = AsyncHandler(async(req, res)=>{

    const initialToken = req.cookies.refreshToken
    if(!initialToken){
        throw new ApiError(400, "no inital refresh token")
    }

    const compareToken = await jwt.verify(initialToken, process.env.REFRESH_TOKEN)
    if(!compareToken){
        throw new ApiError(400, "refresh toke is not verified")
    }

    const admin = await Admin.findById(compareToken._id)
    if(!admin){
        throw new ApiError(400, "admin is no present")
    }

    if(initialToken !== admin.refreshToken){
        throw new ApiError(400, "refresh token doesnot match")
    }

    const {accessToken, refreshToken} = await generateAccessRefreshToken(admin._id)

    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refrehToken", refreshToken, options)
    .json(new ApiResponse(200, {refreshToken, accessToken}, "refreshtoken generated success"))
})

const getCurrentAdmin = AsyncHandler(async(req, res)=>{

    return res.status(200).json(new ApiResponse(200, req.user, "successfuly get admin"))
})


export {adminlogin, adminlogout, createRefreshToken,getCurrentAdmin}