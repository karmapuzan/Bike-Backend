import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/User.model.js"
import {uploadOnCloudinary} from "../utils/Cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res)=>{
    const {fullname,username, email, password} =req.body
    console.log("email: ", email );

    if([fullname, username, email, password].some((field)=> 
        field?.trim() === "")){
            throw new ApiError(400, "All field are requried")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new (409, "User with email or username already exist")
    }

    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log(coverImageLocalPath);
    //for error if the field is required
    // if(!coverImageLocalPath){
    //     throw new ApiError(400, "Cover")
    // }
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // if(!coverImage){
    //     throw new ApiError(400, "Cover")
    // }

    const user = await User.create({
        coverImage: coverImage?.url || "", //to check if the image is pass through or not
        email,
        username : username.toLowerCase(),
        password,
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