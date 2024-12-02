import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.model.js";

export const auth = async (req,res,next) =>{
    try {
        const token = req.header("Authorization")?.replace("Bearar ","")
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SC, function(err, result) {
            if (err) {
                return null
            } else {
                return result
            }
        })

        if (!decodedToken) {
            return res.json("invalid token1")
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return res.json("invalid token2")
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.log("auth", error);
        
    }
}