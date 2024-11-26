import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { allOrders, createOrder } from "../controllers/order.controller.js";


const router = express.Router()


router.route("/order/create").post(auth,createOrder)
router.route("/order").get(auth,allOrders)




export default router