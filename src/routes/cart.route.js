import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { createCart, updateQuantity } from "../controllers/cart.controller.js";

const router = express.Router()


router.route("/cart/create").post(auth,createCart)
router.route("/cart/update").post(auth,updateQuantity)



export default router