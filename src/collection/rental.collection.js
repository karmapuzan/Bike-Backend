import { AsyncHandler } from "../utils/AsyncHandler.js"
import { Bike } from "../models/bike.model.js"
import { ApiResponse } from "../utils/ResponseHandler.js"
import { ApiError } from "../utils/ErrorHandler.js"
import { Rental } from "../models/rental.model.js"
import { User } from "../models/user.model.js"

// 1. Create a Rental
const createRental = AsyncHandler(async (req, res) => {
    const { user_id, bike_id, start_time, end_time, total_cost } = req.body;

    // Validate User
    const user = await User.findById(user_id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Validate Bike
    const bike = await Bike.findById(bike_id);
    if (!bike) {
        throw new ApiError(404, "Bike not found");
    }

    // Ensure that start_time is before end_time
    if (new Date(start_time) >= new Date(end_time)) {
        throw new ApiError(400, "Start time must be before end time");
    }

    // Create the rental
    const rental = new Rental({
        user_id,
        bike_id,
        start_time,
        end_time,
        total_cost,
    });

    // Save the rental
    await rental.save();

    res.status(201).json(new ApiResponse(201, rental, "Rental created successfully"));
});

// 2. Get All Rentals (with pagination and filtering)
const getAllRentals = AsyncHandler(async (req, res) => {
    const { page = 1, limit = 10, user_id, bike_id } = req.query;

    const query = {};
    if (user_id) query.user_id = user_id;
    if (bike_id) query.bike_id = bike_id;

    const rentals = await Rental.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('user_id', 'name email') // populate user fields if needed
        .populate('bike_id', 'name serialNumber'); // populate bike fields if needed

    const totalRentals = await Rental.countDocuments(query);

    res.status(200).json({
        success: true,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalRentals / limit),
        totalItems: totalRentals,
        data: rentals,
    });
});

// 3. Get Rental by ID
const getRentalById = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const rental = await Rental.findById(id)
        .populate('user_id', 'name email')
        .populate('bike_id', 'name serialNumber');

    if (!rental) {
        throw new ApiError(404, "Rental not found");
    }

    res.status(200).json(new ApiResponse(200, rental, "Rental details retrieved successfully"));
});

// 4. Update Rental
const updateRental = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time, total_cost } = req.body;

    const rental = await Rental.findById(id);
    if (!rental) {
        throw new ApiError(404, "Rental not found");
    }

    // Update rental details if provided
    if (start_time) rental.start_time = new Date(start_time);
    if (end_time) {
        if (new Date(start_time) >= new Date(end_time)) {
            throw new ApiError(400, "Start time must be before end time");
        }
        rental.end_time = new Date(end_time);
    }
    if (total_cost) rental.total_cost = total_cost;

    // Save updated rental
    await rental.save();

    res.status(200).json(new ApiResponse(200, rental, "Rental updated successfully"));
});

// 5. Delete a Rental
const deleteRental = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const rental = await Rental.findById(id);
    if (!rental) {
        throw new ApiError(404, "Rental not found");
    }

    // Remove the rental
    await rental.remove();

    res.status(200).json(new ApiResponse(200, null, "Rental deleted successfully"));
});

module.exports = {
    createRental,
    getAllRentals,
    getRentalById,
    updateRental,
    deleteRental,
};
