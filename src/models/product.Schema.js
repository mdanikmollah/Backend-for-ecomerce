import mongoose,{Schema} from "mongoose";
const productSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory:{
         type: mongoose.Types.ObjectId,
         ref: "SubCategory",
         required: true
    },
    inventory:[
        {
            type: mongoose.Types.ObjectId,
            ref: "Inventory"
        } 
    ],
    thumbnail:{
        public_Id:{
            type: String,
            required: true
        },
        imagePath:{
            type: String,
            required: true
        }
    },
    gallery:[
        {
            public_Id:{
                type: String,
            },
            imagePath:{
                type: String,
            }
        }
    ],
    description:{
        type: String 
    }
},{
    timestamps: true
})

export const Product = mongoose.model("Product",productSchema)