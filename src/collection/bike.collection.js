import { AsyncHandler } from "../utils/AsyncHandler.js"
import { Bike } from "../models/bike.model.js"
import { ApiResponse } from "../utils/ResponseHandler.js"
import { ApiError } from "../utils/ErrorHandler.js"
//import { isValidObjectId, Query } from "mongoose"
import { uploadToCoudinary } from "../utils/CloudinaryUpload.js"
//import { BikeType } from "../models/bikeType.model.js"
import { Location } from "../models/location.model.js"




const addBike = AsyncHandler(async(req, res,) =>{
    const {name, serialNumber, description,
        bikeType, price, location, status} =req.body

        console.log("reqbody", req.body)
        console.log("Localimage", req.file)

        // const admin = req.user
        // if(!admin){
        //     throw new ApiError(400,"admin is not logged in")
        // }

        // if(!name || !description){
        //         throw new ApiError(400, "all fields are required")
        //     }
        

        //checking serial number already exists
        const existingBike = await Bike.findOne({serialNumber});
            if(existingBike){
                throw new ApiError (400,"Bike with this serial number already exists")
            }

        //checking location if exists
        if(location){
            const loca = await Location.findById(Location);
            if(!location){
                throw new ApiError(400, "Location doesnt exist")
            }
        }

        // if (name.length<3 || description.length<3 || bikeType.length<3){
        //         throw new ApiError(400,"all fields length should be more than 3 characters")
        //     }

        //letter vaildations
        const nameRegex = /^[A-Za-z\s]+$/;

        if (!nameRegex.test(name) || !nameRegex.test(description) ||  !nameRegex.test(bikeType)){
                throw new ApiError(400,"fields should contain only letters");
            }
        

        //upload images
        //const bikeImageLocalPath = req.files?.bikeImage[0]?.path;
        // if (!bikeImageLocalPath) {
        //     console.log("Debug: req.field is:", req.field); // Log the request field to see what's being passed
        //     throw new ApiError(400, "Local image path is not set");
        // }

        // const bikeImageLocalPath = req.file?.path
        // if(!bikeImageLocalPath){
        // throw new ApiError(400, "profile local url in not found")
        // }
        // console.log("file path", bikeImageLocalPath)
        
        // const image = await uploadToCoudinary(bikeImageLocalPath)
        // if(!image.url){
        //     throw new ApiError(400, "Imager Url is not Found in the Cloudinary")
        // }

        const uploadbike = await Bike.create({
            name,
            description,
            serialNumber,
            price,
            location: Location || null,
            bikeType:name._id,
            bikeImageLocalPath:image.url,
            status: status || 'available'
        })

        await uploadbike.save();

        const uploadBikeItem  = await Bike.findById(uploadBikeItem._id)
        if(!uploadBikeItem){
            throw new ApiError(400, "field is not uploaded")
        }

        return res.status(200).json(new ApiResponse(200, uploadBikeItem, "success adding data"))

})


///Get all Bikes
const getBikes = AsyncHandler(async(req,res,next)=>{
    
    try {
        const {page = 1, limit =10, bikeType, status, sortBy, order = 'asc' } =req.query;
    
        const query = {};
        
        if(bikeType){
            query.bikeType = bikeType;
        }
    
        if(status){
            query.status = status;
        }
    
        //Defining Sorting Logic 
    
        const sortOrder = order ==='desc'? -1:1;
        const sortOption ={};
    
        if(sortBy){
            sortOption[sortBy] =sortOrder; //sort by the provided field and order
        }
    
        //Fetch the total count of bikes
        const bike = await Bike.find(query)
        .sort(sortOption)
        .sort((page)-1)
        .limit(Number(limit));
    
        const totalBikes = await Bike.countDocuments(query);
    
        res.status(200).json({
            success:true,
            page:Number(page),
            limit:Number(limit),
            totalPages:Math.ceil(totalBikes / limit),
            totalItems: totalBikes,
            data : bikes,
        });
    } catch (error) {
        throw new ApiError(500, "Bike not found ---------")
    }

})

export {addBike, getBikes}
