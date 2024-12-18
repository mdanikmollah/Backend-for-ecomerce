import apiResponse from "quick-response";
import { Variation } from "../models/variation.Schema.js";

const createVariation = async (req, res) => {
    try {
        const { size:sizename,category,color }  = req.body;
        console.log(req.body);

        
        // Check if a variation with the same name already exists
        const existingVariation = await Variation.findOne({"size.sizename":sizename});
        if (existingVariation) {
            return res.json(apiResponse(400, "Name must be unique", {}));
        }
        const variation = await Variation.create({ size: { sizename, category }, color })
        return res.json(apiResponse(201,"variation created",variation))
        // // Create a new variation if the name is unique
        // const newVariation = {
        //     size:{sizename,category:[category]},color
        // }
        // const variation = await Variation.create(newVariation);
        // return res.json(apiResponse(201, "Variation created", { variation }));
        
    } catch (error) {
        console.log("error",error);
        return res.json(apiResponse(500, "Server error", {}));
    }
}

const getVariations = async (req, res) => {
    const variation = await Variation.find()
    return res.json(apiResponse(200, "variation list", { variation }))
}

export { createVariation,getVariations };
