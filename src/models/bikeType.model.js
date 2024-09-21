import mongoose, { Schema } from "mongoose";

const bikeType = new Schema({
    name:{
        type:String,
        required: true,
        trim:true
    }
})


export const BikeType = mongoose.model('BikeType', bikeTypeSchema)