import mongoose from "mongoose"
import { dbUrl } from './../config/index.js'

//console.log("fdgdsgd");


const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl)
    console.log("Database Connected")
  } catch (error) {
    console.log(error.message)
  }
}
export default connectDb