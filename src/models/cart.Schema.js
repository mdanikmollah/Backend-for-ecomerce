import mongoose,{Schema} from "mongoose";

const cartSchema = new Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    product:{
        type: mongoose.Types.ObjectId,
        ref: "Product"
    },
    inventory:{
        type: mongoose.Types.ObjectId,
        ref:"Inventory"
    },
    quantity:{
        type: Number
    }
},{
    timestamps: true
})

export const Cart = mongoose.model("Cart",cartSchema)