import apiResponse from "quick-response"
import { Category } from "../models/category.Schema.js"


 const categoryCreate = async(req,res) =>{
    try {
        let newSlug  
        const { name, slug } = req.body
        if (!name) {
           return res.json(apiResponse(400, "name is required")) 
        }
        if (!slug) {
            newSlug = name.replaceAll(" ", "-").toLowerCase()
        }else{
            newSlug = slug.replaceAll(" ", "-").toLowerCase()
        }
        const category = await Category.create({ name, slug: newSlug })
        return res.json(apiResponse(201,"category created", { category }))
    } catch (error) {
        console.log(error);
        
    }
}

const getCategory = async(_,res)=>{
    const categories = await Category.find()
    return res.json(apiResponse(200,"categories",categories))
}

export { categoryCreate,getCategory }