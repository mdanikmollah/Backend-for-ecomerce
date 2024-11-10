import mongoose,{Schema} from "mongoose";
const variationSchema = new Schema({
    name:{
        type: String
    }

},{ timestamps:true })

export const Variation = mongoose.model("Variation", variationSchema)