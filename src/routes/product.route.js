import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { createProduct, deleteProduct,  products,  singleProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router()


router.route("/products/create").post(upload.fields([{ name: 'thumbnail' },{ name: 'gallery', maxCount:4 }]), createProduct)
router.route("/products/delete/:id").delete(deleteProduct)
//router.route("/products").get(pagination)
router.route("/products").get(products)
router.route("/products/:slug").get(singleProduct)



export default router