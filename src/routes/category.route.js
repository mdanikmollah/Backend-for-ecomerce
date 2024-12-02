import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { categoryCreate,getCategory } from "../controllers/category.controller.js";
const router = express.Router()


router.route("/categories/create").post(auth,adminAuth,categoryCreate)
router.route("/categories").get(getCategory)



export default router