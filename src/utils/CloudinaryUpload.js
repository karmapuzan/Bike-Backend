import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadToCoudinary = async (filepath)=>{
    try {

        if(!filepath)return null

        const response = await cloudinary.uploader.upload(filepath, {resource_type: "auto"})
        fs.unlinkSync(filepath)
        return response;

        
    } catch (error) {
        fs.unlinkSync(filepath)
        console.log("error in cloudinary ", error)
        return null;

        
    }
}

export {uploadToCoudinary}




