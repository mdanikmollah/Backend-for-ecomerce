import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { createCart, getCart, updateQuantity } from "../controllers/cart.controller.js";

const router = express.Router()


router.route("/cart/create").post(createCart)
router.route("/cart/update").post(updateQuantity)
router.route("/cart/:userId").get(getCart)



export default router