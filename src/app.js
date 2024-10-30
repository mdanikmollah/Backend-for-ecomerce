import express from "express"
import cors from "cors"
import userRouter from "./routes/userRoute.route.js"

const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"))
app.use(cors({
    origin: "*",
    credential: true
}))

app.use("/api/v1",userRouter)

export default app