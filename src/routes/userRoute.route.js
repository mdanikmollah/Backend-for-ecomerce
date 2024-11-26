import express from "express"
import { createuser, emailVerify,  forgotPassword,  login, logout, resetPassword, userUpdate } from "../controllers/userController.controller.js";
import { validation } from "../middlewares/validation.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router()

// router.route("/user").get(createuser)
router.route("/user/create").post(validation, createuser)
router.route("/user/:link").get(emailVerify)
router.route("/user/logout").post(auth, logout)
router.route("/user/update").post(auth,upload.single("profilePic"),userUpdate)
router.route("/user/login").post(login)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").patch(resetPassword)


export default router