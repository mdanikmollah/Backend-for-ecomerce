import apiResponse from "quick-response";
import { Variation } from "../models/variation.Schema.js";

const createVariation = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if a variation with the same name already exists
        const existingVariation = await Variation.findOne({ name });
        if (existingVariation) {
            return res.json(apiResponse(400, "Name must be unique", {}));
        }

        // Create a new variation if the name is unique
        const variation = await Variation.create({ name });
        return res.json(apiResponse(201, "Variation created", { variation }));
    } catch (error) {
        console.log(error);
        return res.json(apiResponse(500, "Server error", {}));
    }
}

export { createVariation };
