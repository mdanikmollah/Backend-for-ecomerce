import apiResponse from "quick-response";
import { Variation } from "../models/variation.Schema.js";

const createVariation = async (req, res) => {
    try {
      const { size, color } = req.body
      const { sizename, category } = size
  
      const existingVariation = await Variation.findOne({
        'size.sizename': sizename,
      })
      // if (existingVariation) {
      //   return res.json(apiResponse(400, 'size name must be unique', {}))
      // }
  
      const variation = await Variation.create({
        size: { sizename, category },
        color,
      })
  
      return res.json(apiResponse(201, 'Variation created', variation))  
    } catch (error) {
      console.log('error', error)
      return res.json(apiResponse(500, 'Server error', {})) 
    }
  }

const getVariations = async (req, res) => {
    const variation = await Variation.find()
    return res.json(apiResponse(200, "variation list", { variation }))
}

export { createVariation,getVariations };
