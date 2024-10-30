import { v2 as cloudinary } from 'cloudinary';
import { unlinkSync } from 'fs'


    // Configuration
    cloudinary.config({ 
        cloud_name: 'dwxut205e', 
        api_key: '989562112188796', 
        api_secret: 'e8Ry3iPsGtOgiobEIICwO8redV4' // Click 'View API Keys' above to copy your API secret
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
