import mongoose, {Schema} from "mongoose";


const rentalSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    bike_id: {
        type: Schema.Types.ObjectId,
        ref: 'Bike',  
        required: true,
    },
    start_time: {
        type: Date,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    total_cost: {
        type: Number,
        required: true,
    },
});

// Optionally, calculate total_cost automatically before saving, if desired
rentalSchema.pre('save', function(next) {
    const rentalDuration = (this.end_time - this.start_time) / (1000 * 60 * 60); // Calculate duration in hours
    const hourlyRate = 10; // Example rate per hour, you can adjust it based on your business logic
    this.total_cost = rentalDuration * hourlyRate;
    next();
});

const Rental = mongoose.model('Rental', rentalSchema);
export default Rental;
