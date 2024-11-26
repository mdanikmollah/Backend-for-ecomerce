import mongoose,{Schema} from "mongoose";
const variationSchema = new Schema({
    size:{
        Sizename:{
            type: String
        },
        category:[
            {
                type: mongoose.Types.ObjectId,
                ref: "Category"
            }
        ]
    },
    color:{
        type: String
    },

},{ timestamps:true })

export const Variation = mongoose.model("Variation", variationSchema)