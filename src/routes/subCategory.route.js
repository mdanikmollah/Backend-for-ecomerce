import express from "express"
import { auth } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";
import { allSubCategories, subCategoryCreate } from "../controllers/subCategory.controller.js";
const router = express.Router()


router.route("/subcategories/create").post(auth,adminAuth,subCategoryCreate)
router.route("/subcategories").get(allSubCategories)



export default router