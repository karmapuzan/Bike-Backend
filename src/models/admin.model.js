import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const adminSchema = new Schema({

    email: {
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    password: {
        type:String,
        require:true
    },
    refreshToken: {
        type:String
        
    }
})

adminSchema.pre("save", async function(next){
    if(!this.isModified("password"))return

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    
        next()
    } catch (error) {
        console.log("error in hasing password", error)
        next(error)
        
    }

})


adminSchema.methods.comparepassword = async function (password) {

    if(this.password !== password){
        console.log("password doesnot match")
    }
    else {
        return true
    }
    
}


adminSchema.methods.accessTokenGenerator = async function () {

    try {
        const token = await jwt.sign({_id: this._id, email:this.email},
        process.env.ACCESS_TOKEN, {expiresIn:process.env.ACCESS_TOKEN_DATE})

        return token
    
    } catch (error) {
        console.log("error generating access token ", error)
    }

    
}

adminSchema.methods.refreshTokenGenerator = async function () {

    try{
        const token = await jwt.sign({_id: this._id},
        process.env.REFRESH_TOKEN, {expiresIn: process.env.REFRESH_TOKEN_DATE})

        return token

    }
    catch(error){
        console.log("error generating refresh token", error)
    }
    
}

export const Admin = mongoose.model("Admin", adminSchema)