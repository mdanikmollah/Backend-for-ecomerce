import express from "express"
import cors from "cors"
import userRouter from "./routes/userRoute.route.js"
import categoryRouter from "./routes/category.route.js"
import subCategoryRouter from "./routes/subCategory.route.js"
import productRouter from "./routes/product.route.js"
import variationRouter from "./routes/variation.route.js"
import inventoryRouter from "./routes/inventory.route.js"
import cartRouter from "./routes/cart.route.js"
import orderRouter from "./routes/order.route.js"
import paymentRouter from "./routes/payment.route.js"

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
app.use("/api/v1",categoryRouter)
app.use("/api/v1",subCategoryRouter)
app.use("/api/v1",productRouter)
app.use("/api/v1",variationRouter)
app.use("/api/v1",inventoryRouter)
app.use("/api/v1",cartRouter)
app.use("/api/v1",orderRouter)
app.use("/api/v1",paymentRouter)



export default app