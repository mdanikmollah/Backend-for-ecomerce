import apiResponse from "quick-response"
import { Inventory } from "../models/inventory.Schema.js"
import { Product } from "../models/product.Schema.js"
const createInventory = async(req,res)=>{
    try {
        const { product,variation,purchasePrice,sellingPrice,discountPrice,quantity } = req.body
        if ([ product,variation,purchasePrice,sellingPrice,quantity].some((field)=>field === "")) {
            return res.json(apiResponse(400,"all fields are required"))
        }
        const inventory = await Inventory.create({product,variation,purchasePrice,sellingPrice,discountPrice,quantity})
        await Product.findByIdAndUpdate({_id: product }, { $push:{ inventory: inventory._id }})
        return res.json(apiResponse(201, "inventory created", { inventory }));
    } catch (error) {
        console.log("dswd",error);
        
    }
}

const updateInventory = async(req,res)=>{
    try {
        const { id } = req.params
        const { product,variation,purchasePrice,sellingPrice,discountPrice,quantity } = req.body
        if ([ product,variation,purchasePrice,sellingPrice,quantity].some((field)=>field === "")) {
            return res.json(apiResponse(400,"all fields are required"))
        }
        const isFound = await Inventory.findById({ _id: id })
        if (!isFound) {
            return res.json(apiResponse(404,"inventory not found"))
        }
        const inventory = await Inventory.findByIdAndUpdate({ _id: id },{ $set:{product,variation,purchasePrice,sellingPrice,discountPrice,quantity}},{
            new: true
        })
        if (product != isFound.product) {
            await Product.findByIdAndUpdate({_id: product }, { $push:{ inventory: inventory._id }})
        }
        return res.json(apiResponse(201, "inventory update", { inventory }));
    } catch (error) {
        console.log("dwd",error);
        
    }
}

const allInventory = async(_, res)=>{
    try {
        const inventory = await Inventory.find().populate("product").populate("variation")
        return res.json(apiResponse(200, "inventory list", { inventory }));
    } catch (error) {
        console.log("dsd",error);
        
    }
}

const deleteById = async(req, res)=>{
    try {
        const { id } = req.params
        const inventory = await Inventory.findOneAndDelete({ _id: id })
        return res.json(apiResponse(200, "inventory deleted", { inventory }));
    } catch (error) {
        console.log("dd",error);
        
    }
}

export { createInventory,updateInventory,allInventory,deleteById }