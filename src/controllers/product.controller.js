import apiResponse from "quick-response"
import { Product } from "../models/product.Schema.js"
import { cloudinaryUpload } from "../services/cloudinary.js"

const createProduct = async(req,res)=>{
    try {

        const { title,slug,category,subcategory } = req.body
        const { thumbnail } = req.files
        if ([title,category,subcategory].some((field) => field === "")) {
            return res.json(apiResponse(400,"all fields are required"))
        }
        if (!thumbnail) {
            return res.json(apiResponse(400,"all thumbnail are required"))
        }
        let newSlug
        if (!slug) {
            newSlug = title.replaceAll(" ", "-").toLowerCase() + "-" +  Date.now()
        }else{
            const isSlugUnique = await Product.find({ slug })
            if (isSlugUnique) {
                return res.json(apiResponse(400,"slug must be unique"))
            }
            newSlug = slug.replaceAll(" ", "-").toLowerCase() + "-" +  Date.now()
        }
        const { path } = thumbnail[0]
        const result = await cloudinaryUpload(path, slug,"product")
    //     let resultAll;
    //     if (req.files?.gallery) {
    //         const { gallery } = req.files;
    //         const allResolvePromisesCloudunary = gallery.map(async({path})=>{

    //             return await cloudinaryUpload(path,slug,"productGallery")
    //         });
    //        resultAll = await Promise.all(allResolvePromisesCloudunary)
    //     }
    //    console.log(resultAll);
       

    const product = new Product()
    if (req.files?.gallery) {
        let public_id
        const { gallery } = req.files
        //const galleryImages = gallery.map((item) => item)
  
        for (let image of gallery) {
            public_id = image.fieldname + Date.now() + '-' + Math.round(Math.random() * 1E9)
          const uploadedGalleryImage = await cloudinaryUpload(
            image.path,
            public_id,
            'product/gallery'
          )
          console.log("aaa",uploadedGalleryImage);
          
  
          product.gallery.push({
            imagePath: uploadedGalleryImage.optimizeUrl,
            public_Id: public_id,
          })
        }
      }
        
        
        product.title = title
        product.category = category
        product.subcategory = subcategory
        product.slug = newSlug
        product.thumbnail.imagePath = result.optimizeUrl
        product.thumbnail.public_Id = result.uploadResult.public_id
        await product.save()
        res.json(apiResponse(201,"product create",{product}))
    } catch (error) {
        console.log(error);
        
    }
}

export { createProduct }

