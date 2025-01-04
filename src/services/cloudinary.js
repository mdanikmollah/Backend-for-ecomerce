import { v2 as cloudinary } from 'cloudinary';
import { unlinkSync } from 'fs'
import { cloud_name, api_key, api_secret } from "../config/index.js"

//console.log("aas");

// Ensure the API secret is available
if (!api_secret || !api_key || !cloud_name) {
    throw new Error("Cloudinary configuration is missing in environment variables.");
}
    // Configuration
    cloudinary.config({ 
        cloud_name, 
        api_key, 
        api_secret, // Click 'View API Keys' above to copy your API secret
    });
    
    export const cloudinaryUpload = async(path, public_id, folder)=>{
        // Upload an image
        let uploadResult;
     try {
        uploadResult = await cloudinary.uploader
        .upload(path, {
                public_id,
                folder    
        });
        unlinkSync(path)
     } catch (error) {
        unlinkSync(path)
        console.error("Upload Error:", error);
        return {error: 'Upload failed', uploadResult: null};
        
     }
  
  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
  });
  
  
  
  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url(uploadResult.public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
  });
  
    return { uploadResult, optimizeUrl, autoCropUrl  }
}
