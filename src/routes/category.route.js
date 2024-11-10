import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { categoryCreate } from "../controllers/category.controller.js";
const router = express.Router()


router.route("/categories/create").post(auth,adminAuth,categoryCreate)



export default router