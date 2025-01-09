import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { pay, paySuccess } from "../controllers/payment.controller.js";
import { createOrder } from "../controllers/order.controller.js";



const router = express.Router()



router.route("/pay").post( pay)
router.route("/pay/success").post( paySuccess, createOrder)




export default router