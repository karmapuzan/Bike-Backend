import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadToCoudinary } from "../utils/CloudinaryUpload.js";
import { ApiError } from "../utils/ErrorHandler.js";
import { ApiResponse } from "../utils/ResponseHandler.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'

const createAccessRefreshToken = async(userId)=>{

    try {
        const user = await User.findById(userId)
    
        if(!user){
            throw new ApiError(400, "please provide user id")
        }
        const accessToken = await user.accessTokenGenerator()
        const refreshToken = await user.refreshTokenGenerator()
    
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave:false})
    
        return {accessToken, refreshToken}
    } catch (error) {

        console.log("error in creating access and refresh token ", error)
        
    }
    
    

}
/// -------------------------REGISTER USER------------------------------------------------------------
const registerUser = AsyncHandler(async(req, res)=>{
    const {name, email, password, address,contact } = req.body
    console.log(req.body)

    if(!name || !email || !password || !address || !contact){
        throw new ApiError(400, "all fields are required")
    }

    if(name.length < 3 || address.length < 3){
        throw new ApiError(400, "field should be atleast 4 character")
    }
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name) || !nameRegex.test(address)) {
        throw new ApiError(400, "fields should contain only letters");
    }

    if(password.length < 6){
        throw new ApiError(400, "password length should be more than 6 character")
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    const phoneRegex = /^(98|97)\d{8}$/;

    if (!phoneRegex.test(contact)) {
        throw new ApiError(400, "Phone number must start with 98 or 97 and contain exactly 10 digits");
    }

    
    const profilelocal = req.file?.path
    if(!profilelocal){
        throw new ApiError(400, "profile local url in not found")
    }
    console.log("file path", profilelocal)
    

    const profile = await uploadToCoudinary(profilelocal)
    if(!profile.url){
        throw new ApiError(400, "profile url is not found in cloudinary")
    }
    
    console.log("name",name,
        "email",email,
        "password", password,
        "address",address,
        "contact", contact,"profile",profile.url)
    let user
    try {
        user = await User.create({
            name,
            email,
            password,
            address,
            contact,
            profile: profile.url
        })
        
    } catch (error) {
        console.log("error creating user")
        
    }

    const userdetail = await User.findById(user._id)
    if(!userdetail){
        throw new ApiError(400, "user detail is not found")
    }



    

    return res.status(200).json(new ApiResponse(200, userdetail, "user register success"))
})

//=======================================================================================================

/// -------------------------Login User------------------------------------------------------------
// const loginUser = AsyncHandler(async(req, res)=>{

//     const {email, password} = req.body

//     if(!email || !password){
//         throw new ApiError(400, "email, password is required")
//     }

//     const user = await User.findOne({email: email})
//     if(!user){
//         throw new ApiError(400, "user not found")
//     }

//     const compare = await user.comparePassword(password)
//     if(!compare){
//         throw new ApiError(400, "error in compare password password doesnot match")
//     }

//     // const {accessToken, refreshToken} = await createAccessRefreshToken(user._id)
    
//     // if(!accessToken || !refreshToken){
//     //     throw new ApiError(400, "access token and refresh token is not generated")
//     // }

//     const createAccessRefreshToken = async (userId) => {
//         try {
//             const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
//             const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            
//             return { accessToken, refreshToken };
//         } catch (error) {
//             console.error("Token creation failed:", error);
//             return { accessToken: null, refreshToken: null }; // Return null or handle it
//         }
//     };

//     const loggedInUser = await User.findById(user._id)
//     if(!loggedInUser){
//         throw new ApiError(400, "user is not logged in ")
//     }
//     // return res.status(200)
//     // // .cookie("accessToken", accessToken, options)
//     // // .cookie("refreshToken", refreshToken, options)
//     // .json(new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "user logged in success"))
//     return res.status(200).json({
//         user: loggedInUser,
//         accessToken,
//         refreshToken,
//         message: "User logged in successfully"
//     });

// })

const loginUser = AsyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await createAccessRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200).json({
        user: loggedInUser,
        accessToken,
        refreshToken,
        message: "User logged in successfully"
    });
});



//=========================================================================================================================



const logoutUser = AsyncHandler(async(req, res)=>{
    console.log("logout age")
    const user = req.user
    console.log(user)
    if(!user){
        throw new ApiError(400, "you are not logged in")
    }

    await User.findByIdAndUpdate({_id: user._id},
        {
            $set:{
                refreshToken: undefined
            }
        },{
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    


    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken",  options)
    .json(new ApiResponse(200, {}, "logout success"))


})

const logoutUsers = AsyncHandler(async(req, res)=>{

    console.log("logut page")
    return res.status(200).json(new ApiResponse(200, {}, "logout success"))
})


const getCurrentUser = AsyncHandler(async(req, res)=>{

    const user = req.user

    return res.status(200).json(new ApiResponse(200, user, "current user"))
})


const refreshAccessToken = AsyncHandler(async(req, res)=>{
    const incommingrefreshToken = req.cookies.refreshToken
    

    try {
        const decode = await jwt.verify(incommingrefreshToken, process.env.REFRESH_TOKEN)
        if(!decode){
            throw new ApiError(400, "error in verifyin refresh token ")
        }
    
    
    
        const user = await User.findById({_id: decode._id})
        
        if(!user){
            throw new ApiError(400, "user not availble")
        }
    
        if(incommingrefreshToken !== user?.refreshToken){
            throw new ApiError(400, "token doesnot match with user token")
        }
    
        const {accessToken, refreshToken} = await createAccessRefreshToken(user._id)
        
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {token: accessToken, refreshToken}, "refeshing access token"))
    } catch (error) {

        console.log("error refreshing token ", error)
        
    }
})

const getAllUser = AsyncHandler(async(req, res)=>{
    const admin = req.user
    if(!admin){
        throw new ApiError(400, "admin must be logged in")
    }

    const users = await User.find()

    return res.status(200).json(new ApiResponse(200, users, "users fetch succeess"))
})

const deleteUser = AsyncHandler(async(req, res)=>{
    const {id} = req.params
    if(!isValidObjectId(id)){
        throw new ApiError(400 , "provided id is not a valid object id")
    }
    const admin = req.user
    if(!admin){
        throw new ApiError(400, "admin must be logged in")
    }

    await User.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200, {}, "user deleted success "))
})

export {registerUser, loginUser, getCurrentUser,logoutUser, logoutUsers,refreshAccessToken, getAllUser,deleteUser}

