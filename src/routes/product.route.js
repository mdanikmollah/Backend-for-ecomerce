import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { categoryCreate } from "../controllers/category.controller.js";
import { createProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router()


router.route("/products/create").post(upload.fields([{ name: 'thumbnail' },{ name: 'gallery', maxCount:4 }]), createProduct)



export default router