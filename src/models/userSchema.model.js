import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from 'crypto'

const userSchema = new Schema({
    displayName: {
        type: String,
        required: [true, "name is required"],
        trim: true 
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        lowercase: true 
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength:[8,"minimum length is 8"],
        //select: false
    },
    phoneNumber: {
        type: String,
        // unique: true,
        // default: null
    },
    emailverified: {
        type: Date,
    },
    resetPasswordToken: {
        type: String,
    },
    profilePic: {
        type: String
    },
    public_Id: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin", "editor"],
        lowercase: true,
        default: "user"
    },
    address:[
        { street:String }, { postalCode: String }, { district: String }, { country: String }
    ],
    refreshToken:{
        type: String
    },
    passwordResetToken: {
        type: String,
      },
      passwordResetExpires: Date,
      refreshToken: {
        type: String,
      },


    
},{
    timestamps: true
})

userSchema.pre("save",async function(next){
    if (this.isModified("password")) {
        
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.cheakPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function() {
   return jwt.sign({
       id: this._id,
       email: this.email,
       displayName: this.displayName,
       role: this.role
      },  process.env.ACCESS_TOKEN_SC, { expiresIn: process.env.ACCESS_TOKEN_EX });
}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
        id: this._id,
        email: this.email,
        displayName: this.displayName,
        role: this.role
       },  process.env.REFRESH_TOKEN_SC, { expiresIn: process.env.REFRESH_TOKEN_EX });
 }

 userSchema.methods.AccessTokenVerify = function(token) {
    return  jwt.verify(token, process.env.ACCESS_TOKEN_SC, function(err,decoded) {
        if (err) {
            return null
        }
        
        return decoded
        
    }); 
    }

    // generate password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
  
    console.log({ resetToken }, this.passwordResetToken)
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  
    return resetToken
  }

export const User = mongoose.model("User", userSchema)