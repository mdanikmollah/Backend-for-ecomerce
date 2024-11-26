import apiResponse from "quick-response"
import { Order } from "../models/order.Schema.js"
import { Shipping } from "../models/shipping.Schema.js"
import { v4 as uuidv4 } from 'uuid';

const createOrder = async(req,res)=>{
   try {
     const { total,subTotal,name,address,city,district,postcode,phone,email,
     shippingCost,paymentType,orderedProducts,isShipping,sname,saddress,scity,sdistrict,spostcode,sphone,semail } = req.body
     const orderId = uuidv4()
     const orderDeatils = new Order()
      if ([total,subTotal,name,address,city,district,postcode,phone,email,
          shippingCost,paymentType,orderedProducts,isShipping,sname,saddress,scity,sdistrict,spostcode,sphone,semail].some((field)=>field === "")) {
          return res.json(apiResponse(400,"all fields are required"))
         
     }else if(isShipping){
        const shippingDeatils = await Shipping.create({sname,saddress,scity,sdistrict,spostcode,sphone,semail})
        orderDeatils.user = req.user._id;
        orderDeatils.orderId = orderId;
        orderDeatils.total = total;
        orderDeatils.subTotal = subTotal;
        orderDeatils.postcode = postcode;
        orderDeatils.name = name;
        orderDeatils.address = address;
        orderDeatils.city = city;
        orderDeatils.district = district;
        orderDeatils.phone = phone;
        orderDeatils.email = email;
        orderDeatils.isShipping = isShipping;
        orderDeatils.shippingCost = shippingCost;
        orderDeatils.paymentType = paymentType;
        orderDeatils.orderedProducts = orderedProducts;
        orderDeatils.shipping = shippingDeatils._id
        await orderDeatils.save()
     }else{
      orderDeatils.user = req.user._id;
      orderDeatils.orderId = orderId;
      orderDeatils.total = total;
      orderDeatils.subTotal = subTotal;
      orderDeatils.postcode = postcode;
      orderDeatils.name = name;
      orderDeatils.address = address;
      orderDeatils.city = city;
      orderDeatils.district = district;
      orderDeatils.phone = phone;
      orderDeatils.email = email;
      orderDeatils.shippingCost = shippingCost;
      orderDeatils.paymentType = paymentType;
      orderDeatils.orderedProducts = orderedProducts;
      await orderDeatils.save()
   }
   return res.json(apiResponse(201,"order done",{orderDeatils}))
   } catch (error) {
    console.log("Bristy",error);
   }
}

const allOrders = async(req,res)=>{
   try {
      const allOrders = await Order.find().populate("user").populate("shipping").populate("orderedProducts.product").populate("orderedProducts.inventory")
      return res.json(apiResponse(200,"all order",{ allOrders }))
   } catch (error) {
      
   }
}

export {createOrder,allOrders}
