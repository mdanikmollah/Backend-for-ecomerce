import apiResponse from "quick-response"
import { Product } from "../models/product.Schema.js"
import { cloudinaryUpload } from "../services/cloudinary.js"
import { Inventory } from "../models/inventory.Schema.js"
import { Category } from "../models/category.Schema.js"
import { SubCategory } from "../models/subCategorySchema.js"

const createProduct = async(req,res)=>{
    try {

        const { title,slug,category,subcategory, } = req.body
        console.log(req.body);
        
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
        
        console.log("u ok");
        
        product.title = title
        product.category = category
        product.subcategory = subcategory
        product.slug = newSlug
        product.thumbnail.imagePath = result.optimizeUrl
        product.thumbnail.public_Id = result.uploadResult.public_id
        await product.save()
        console.log("samiya");
        
        res.json(apiResponse(201,"product create",{product}))
    } catch (error) {
        console.log(error);
        
    }
}

const products = async (req, res) => {
    try {
        // const { search, category, priceMin, priceMax, sortBy } = req.query;
        const { search, category, sortBy } = req.query;

        let filter = {};

        // Search by keyword
        if (search) {
            filter.$text = { $search: search };
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by price range
        // if (priceMin || priceMax) {
        //     filter.price = {};
        //     if (priceMin) filter.price.$gte = Number(priceMin);
        //     if (priceMax) filter.price.$lte = Number(priceMax);
        // }

        // Apply sorting
        let sort = {};
        if (sortBy) {
            const [key, order] = sortBy.split(':'); // e.g., 'price:asc'
            sort[key] = order === 'asc' ? 1 : -1;
        }

        // Execute the query
        const products = await Product.find(filter).sort(sort).populate('category').populate('subcategory').populate('inventory');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const singleProduct = async (req, res) => {
    const { slug } = req.params
    const product = await Product.findOne({ slug }).populate('category').populate('subcategory').populate({
        path: 'inventory',
        populate: {
            path: 'variation',
            model: 'Variation'
        }
    })
    return res.json({ product })
}

const deleteProduct = async(req,res)=>{
    try {
        const { id } = req.params
        await Inventory.deleteMany({product: id})
        await Product.findByIdAndDelete({_id: id})
        res.json("delete")
    } catch (error) {
        console.log("asa",error);
        
    }  
}

const pagination = async(req,res)=>{
    try {
        const { page,limit, category,subcategory,price_s } = req.query
        let filter = {}

        if (category) {
            const categoryDoc = await Category.findOne({name: category})
            if (categoryDoc) {
                filter.category = categoryDoc._id
               
                
            }
        }

        if (subcategory) {
            const subcategoryDoc = await SubCategory.findOne({name: subcategory})
            if (subcategoryDoc) {
                filter.subcategoryDoc = subcategoryDoc._id
               
                
            }
        }
        let sortOrder = {};
        // if (price_s === "ASC") {
        //     const inventoryDoc = await Inventory.find({ name: category }).sort(1);
        //     sortOrder["inventory.sellingPrice"] = 1
        // } else if (price_s === "DESC"){
        //     sortOrder["inventory.sellingPrice"] = -1
        // }
        
        // const products = await Product.find(filter).populate({ path:"category", select: "name" }).populate({ path:"subcategory", select: "name"})
        // return res.json({products, total:products.length})
        let currentPage = 1
        if (page < 1) {
            const baseLimit = limit || 2
            const skip = Number((currentPage -1) * baseLimit)
            const products = await Product.find(filter).populate({ path:"category", select: "name" }).populate({ path:"subcategory", select: "name"}).populate({path:"inventory",select:"sellingPrice quantity"}).skip(skip).limit(baseLimit).sort({["inventory.sellingPrice"]:1}) 
            const totalProducts = await Product.find(filter).countDocuments()
            const totalPages = Math.ceil((totalProducts / baseLimit))
            console.log(totalPages);
            res.json({ products, totalPages, totalProducts, baseLimit, currentPage, length: products.length  })
        }else{
            currentPage = Number(page || 1)
            const baseLimit = limit || 2
            const skip = Number((currentPage -1) * baseLimit)
            const products = await Product.find(filter).populate({ path:"category", select: "name" }).populate({ path:"subcategory", select: "name"}).populate({path:"inventory",select:"sellingPrice quantity"}).skip(skip).limit(baseLimit).sort({ ["inventory.sellingPrice"]:1 })  
            const totalProducts = await Product.find(filter).countDocuments()
            const totalPages = Math.ceil((totalProducts / baseLimit))
            console.log(totalPages);
            res.json({ products, totalPages, totalProducts, baseLimit, currentPage, length: products.length  })
        }


    } catch (error) {
        console.log("soniya",error);
        
    }
}

export { createProduct, deleteProduct, pagination, products, singleProduct }

