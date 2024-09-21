import { AsyncHandler } from "../utils/AsyncHandler.js"
import { Bike } from "../models/bike.model.js"
import { ApiResponse } from "../utils/ResponseHandler.js"
import { ApiError } from "../utils/ErrorHandler.js"
//import { isValidObjectId, Query } from "mongoose"
import { uploadToCoudinary } from "../utils/CloudinaryUpload.js"
import { BikeType } from "../models/bikeType.model.js"
import { Location } from "../models/location.model.js"




const addBike = AsyncHandler(async (req, res) => {
    const { name, serialNumber, description, bikeType, price, location, status } = req.body;

    console.log("Request Body:", req.body);
    console.log("Local Image:", req.file);

    // Check if bike with the same serial number already exists
    const existingBike = await Bike.findOne({ serialNumber });
    if (existingBike) {
    throw new ApiError(400, "Bike with this serial number already exists");
    }

    // Check if location exists
    let loca = null;
    if (location) {
    loca = await Location.findById(location);
    if (!loca) {
        throw new ApiError(400, "Location does not exist");
    }
    }

    // Validate fields (name, description, bikeType)
    // const nameRegex = /^[A-Za-z\s]+$/;
    // if (!nameRegex.test(name) || !nameRegex.test(description) || !nameRegex.test(bikeType)) {
    // throw new ApiError(400, "Fields should contain only letters");
    // }

    //Upload bike image
    const bikeImageLocalPath = await req.files?.bikeImage?.[0]?.path;
    if (!bikeImageLocalPath) {
    console.log("Debug: req.file is:", req.files);
    throw new ApiError(400, "Local image path is not set");
    }

    const image = await uploadToCoudinary(bikeImageLocalPath);
    if (!image.url) {
    throw new ApiError(400, "Image URL is not found in Cloudinary");
    }

    // Check if bikeType exists
    const bikeTypename = await BikeType.findOne({ name: bikeType });
    if (!bikeTypename) {
    throw new ApiError(400, "Bike type does not exist");
    }

    // Create and save the new bike
    const newBike = await Bike.create({
    name,
    description,
    serialNumber,
    price,
    location: loca ? loca._id : null,
    bikeType: bikeTypename._id,
    bikeImage: image.url || "",
    status: status || 'available',
    });

    await newBike.save();

    const savedBike = await Bike.findById(newBike._id);
    if (!savedBike) {
    throw new ApiError(400, "Bike was not successfully saved");
    }

    return res.status(200).json(new ApiResponse(200, savedBike, "Bike added successfully"));
});

  // Get all Bikes with pagination and filtering
const getBikes = AsyncHandler(async (req, res, next) => {
    try {
    const { page = 1, limit = 10, bikeType, status, sortBy, order = 'asc' } = req.query;

    const query = {};

    if (bikeType) {
        query.bikeType = bikeType;
    }

    if (status) {
        query.status = status;
    }

      // Define sorting logic
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOption = {};

    if (sortBy) {
        sortOption[sortBy] = sortOrder;
    }

      // Fetch the total count of bikes
    const bikes = await Bike.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalBikes = await Bike.countDocuments(query);

    res.status(200).json({
        success: true,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalBikes / limit),
        totalItems: totalBikes,
        data: bikes,
    });
    } catch (error) {
    throw new ApiError(500, "Failed to fetch bikes");
    }
});


//update bike

const updateBike = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, serialNumber, description, bikeType, price, location, status } = req.body;

    // Find the bike by ID
    const bike = await Bike.findById(id);
    if (!bike) {
        throw new ApiError(404, "Bike not found");
    }

    // Check if a new serial number is provided and if it exists
    if (serialNumber && serialNumber !== bike.serialNumber) {
        const existingBike = await Bike.findOne({ serialNumber });
        if (existingBike) {
            throw new ApiError(400, "Bike with this serial number already exists");
        }
    }

    // If location is updated, verify the location exists
    // let loca = bike.location;
    // if (location) {
    //     loca = await Location.findById(location);
    //     if (!loca) {
    //         throw new ApiError(400, "Location does not exist");
    //     }
    // }

    // Update fields
    bike.name = name || bike.name;
    bike.serialNumber = serialNumber || bike.serialNumber;
    bike.description = description || bike.description;
    bike.price = price || bike.price;
    bike.location = loca ? loca._id : bike.location;
    bike.status = status || bike.status;

    // Save the updated bike
    const updatedBike = await bike.save();

    res.status(200).json(new ApiResponse(200, updatedBike, "Bike updated successfully"));
});

//Delete Bikes 
const deleteBike = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the bike by ID
    const bike = await Bike.findById(id);
    if (!bike) {
        throw new ApiError(404, "Bike not found");
    }

    // Delete the bike
    await bike.remove();

    res.status(200).json(new ApiResponse(200, null, "Bike deleted successfully"));
});





export {addBike, getBikes, updateBike, deleteBike}
