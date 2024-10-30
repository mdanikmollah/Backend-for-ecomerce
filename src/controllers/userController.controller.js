import { User } from "../models/userSchema.model.js"
//import bcrypt from "bcrypt"
import { mail } from "../utils/sendMail.js"
import { verificationTemplate } from "../mailTemp/verificationTemplate.js"
import { cloudinaryUpload } from "../services/cloudinary.js"
import apiResponse from "quick-response"
import crypto from 'crypto'
import ApiResponse from "../utils/ApiResponse.js"


const generateTokens = async (id) => {
   try {
      const user = await User.findById({_id:id})
      const accessToken = await user.generateAccessToken()
      const refreshToken = await user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save()
      return { accessToken, refreshToken  }
   } catch (error) {
      console.log(error);
      
   }
}

const createuser = async(req,res)=>{
   try {
   const { displayName, email, password, phoneNumber } = req.body
  
   const isFound = await User.findOne({ email })
   //console.log(isFound);
   if (isFound) {
       return res.json("email ase")
   }
   //const bpass = await bcrypt.hash(password, 10);
   const user = await User.create({ displayName, email, password, phoneNumber })
   const link = await user.generateAccessToken()
   console.log("she",link);
      
   await mail(user.email, "verification", "hello", verificationTemplate(link))
      
      
   return res.json("ok")
   } catch (error) {
      
   }
}

const emailVerify = async (req,res) => {
   try {
      const { link } = req.params
      const user = new User()
      const result = await user.AccessTokenVerify(link)
      console.log(result);
      
      
      if(result){
         const {email} = result
         const userFound = await User.findOne({email})
         if (userFound) {
            if (userFound.emailverified) {
               return res.send("All ready verified")
            }
            userFound.emailverified = Date.now()
            await userFound.save()
            return res.send("verified")
         }else{
            return res.send("invalid")
         }
      }else{
         return res.send("invalid url")
      }
   } catch (error) {
      console.log("verify error", error);
      
   }
   
}

const login = async(req,res)=>{
   try {
      const {email,password} = req.body
      if ( req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password") ) {
           
         if ([email,password].some((field)=>field === "")) {
            return res.send("All field are required")
         }
         }else{
   
            return res.send("Invalid")
         }
         const userFound = await User.findOne({email})
         if (!userFound) {
            return res.send("email and password wrong")
         }
         const isPasswordCorrect = await userFound.cheakPassword(password)
         if (!isPasswordCorrect) {
            return res.send("email and worng password")
         }
         if (!userFound.emailverified) {
            return res.send("email is not verified,please cheak your email")
         }
         const {accessToken,refreshToken} = await generateTokens(userFound._id)
         return res.json( apiResponse(200,"login", { accessToken, refreshToken }))
   } catch (error) {
      console.log(error);
      
   }
}

const userUpdate = async (req,res) => {
  try {
    if (req.file) {
       const {path} = req.file
       const user = await User.findById(req.user._id)
       if (user) {
          const result = await cloudinaryUpload(path, user.displayName,"profilePic")
          user.profilePic = result.optimizeUrl
          user.public_Id = result.uploadResult.public_id
          await user.save()
          res.json(apiResponse(200, "avatar uploaded",{ user }))
       }
    }
  } catch (error) {
      console.log(error); 
  }
  
   
}

const logout = async (req,res) => {
   try {
      const user = await User.findById(req.user.id)
      user.refreshToken = null
      await user.save()
      res.json(apiResponse(200,"Logout successfully done"))
   } catch (error) {
      console.log(error);
   }
}

// forgot password
const forgotPassword = async (req, res, next) => {
   // get user based on posted email
   const user = await User.findOne({ email: req.body.email })
   try {
     if (!user) {
       return res
         .status(404)
         .json(apiResponse(404, 'no user found with this email'))
     }
 
     // generate random reset token
     const resetToken = user.createPasswordResetToken()
     await user.save({ validateBeforeSave: false })
 
     // send it to user's email
     const resetURL = `${req.protocol}://${req.get(
       'host'
     )}/api/v1/users/reset-password/${resetToken}`
 
     const message = `Forgot your password? click to the link to update your password:${resetURL}.\nIf you didn't forget your password, please ignore this email`
 
     await mail({
       email: user.email,
       html: message,
     })
 
     return res
       .status(200)
       .json(apiResponse(200, 'Reset password link send to the email address'))
   } catch (error) {
     user.passwordResetToken = undefined
     user.passwordResetExpires = undefined
     await user.save({ validateBeforeSave: false })
     return res
       .status(500)
       .json(
         apiResponse(
           500,
           'There was an  error sending the email. Try again later'
         )
       )
   }
 }
 
 // reset password
 const resetPassword = async (req, res) => {
   try {
     // get user based on token
     const hashedToken = crypto
       .createHash('sha256')
       .update(req.params.token)
       .digest('hex')
 
     const user = await User.findOne({
       passwordResetToken: hashedToken,
       passwordResetExpires: { $gt: Date.now() },
     })
 
     //  If token has not expired and there is an user, set new password
     if (!user) {
       return res
         .status(400)
         .json(apiResponse(400, 'Token is invalid or has expired'))
     }
     user.password = req.body.password
     user.passwordResetToken = undefined
     user.passwordResetExpires = undefined
 
     await user.save()
 
     // login user and send JWT token
     const token = await user.generateAccessToken()
     return res
       .status(201)
       .json(apiResponse(201, 'password reset done', { token: token }))
   } catch (error) {
     return res
       .status(500)
       .json(apiResponse(500, 'internal server error', { error: error.message }))
   }
 }
 
 // update password
 const updatePassword = async (req, res) => {
   try {
     // get user form the collection
     // const user = await User.findById(req.user.id).select('+password')
     const user = await User.findById(req.user.id)
 
     // check if posted current password is correct
 
     // if so, update password
 
     // log user in, send JWT
   } catch (error) {}
 }

export { createuser, emailVerify, login, logout, generateTokens, userUpdate, forgotPassword, resetPassword, updatePassword }