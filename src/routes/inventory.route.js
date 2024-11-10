import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { allInventory, createInventory, deleteById, updateInventory } from "../controllers/inventory.controller.js";
const router = express.Router()


router.route("/inventories/create").post(auth,adminAuth,createInventory)
router.route("/inventories/update/:id").post(auth,adminAuth,updateInventory)
router.route("/inventories").get(auth,adminAuth,allInventory)
router.route("/inventories/:id").delete(auth,adminAuth,deleteById)



export default router