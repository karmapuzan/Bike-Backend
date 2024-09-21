import mongoose, {Schema} from "mongoose";
import { Location } from "./location.model.js";

const bikeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    serialNumber: {
        type: String,
        unique: true,
        required: true,
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
        type: Schema.Types.ObjectId,
        ref: 'Location',
        
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'maintenance'],
        default: 'available',
    },
});

// Apply the pagination plugin to the schema
bikeSchema.plugin(mongooseAggregatePaginate);

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
