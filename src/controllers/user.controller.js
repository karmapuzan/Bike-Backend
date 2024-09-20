import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/User.model.js"
import {uploadOnCloudinary} from "../utils/Cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res)=>{
    const {fullName,username, email, password} =req.body
    console.log("email: ", email );

    if([fullName, username, email, password].some((field)=> 
        field?.trim() === "")){
            throw new ApiError(400, "All field are requried")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new (409, "User with email or username already exist")
    }
    //console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.field && Array.isArray(req.files.coverImage) &&
    // req.file.coverImage.length>0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // } else {
        
    // }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avater file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avater file is required")
    }
    

    const user = await User.create({
        fullName,
        avatar :avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase(),
        
    })

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken "
    )

    if(!createUser){
        throw new ApiError(500," something went wrong while registering the user")
    }
    
    return res.status(201).json(
        new ApiResponse(200, createUser, "user registered succfully")
    )
})



export {registerUser,}