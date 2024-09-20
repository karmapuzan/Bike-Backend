import mongoose, {Schema} from "mongoose";

const bikeSchema = new Schema(
    {
        Name:{
            type:String,
            required: true,
            unique: true,
            index: true
        },
        serialNumber:{
            type:String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        bikeType: {
            type: String,
            required: true,
        },
        pricePerDay: {
            type: Number,
            required: true,
        },
        currentLocationId: {
            type: Schema.Types.ObjectId, // Assuming the location is another MongoDB document
            ref: 'Location', // Reference to the Location model (if any)
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        image: {
            type: String, // Image URL or file path
            required: false,
        },
        status: {
            type: String,
            enum: ['available', 'unavailable', 'maintenance'], // Example of different status values
            default: 'available',
        },
    },
    {
        timestamps : true 
    }
)

export const Bike = mongoose.model("Bike", bikeSchema)

