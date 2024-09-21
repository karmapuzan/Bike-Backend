import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema({
    name:{
        type:String,
        required: true,
        trim:true
    }
})


export const Location = mongoose.model('Location', locationSchema)