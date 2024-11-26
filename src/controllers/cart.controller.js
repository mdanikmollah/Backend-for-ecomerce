import apiResponse from "quick-response"
import { Cart } from "../models/cart.Schema.js"



const createCart = async(req,res)=>{
    try {
        const { user,product,inventory,quantity } = req.body
        if ([user,product,inventory,quantity].some((field) => field === "")){
           return res.json(apiResponse(400,"all fields are required")) 
        }
        const isCart = await Cart.findOne({user,inventory}) 
        console.log(isCart);
        if (isCart) {
            const cart = await Cart.findByIdAndUpdate({_id: isCart._id},{$inc: { quantity:1 }},{ new:true })
            return res.json(apiResponse(201,"cart updated", {cart} )) 
        }else{
            const cart = await Cart.create({user,product,inventory,quantity})
            return res.json(apiResponse(201,"cart created", {cart} )) 
        }
    } catch (error) {
        console.log("cart",error);
        
    }
}

const updateQuantity = async(req,res)=>{
    try {
        const { user,inventory,value } = req.body
        if ([user,inventory,value].some((field) => field === "")){
            return res.json(apiResponse(400,"all fields are required")) 
        }
        if (value === "plus") {
            const cart = await Cart.findOneAndUpdate({user,inventory},{$inc: { quantity:1 }},{ new:true })
            return res.json(apiResponse(201,"cart updated", {cart} )) 
        }else if(value === "minus"){
            const cart = await Cart.findOneAndUpdate({user,inventory},{$inc: { quantity:-1 }},{ new:true })
            return res.json(apiResponse(201,"cart updated", {cart} )) 
        }

    } catch (error) {
        console.log("cart",error);
        
    }
}

export {createCart,updateQuantity}