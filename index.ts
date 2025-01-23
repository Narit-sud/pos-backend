import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { UserRouter } from "./src/routers/user"
import { CategoryRouter } from "./src/routers/category"
import { ProductRouter } from "./src/routers/product"
import { pool } from "./src/utils/pool"
import { AuthRouter } from "./src/routers/auth"
import { TestingRouter } from "./src/routers/testing"
import { verifyToken } from "./src/middlewares/verifyToken"

const app = express()

app.use(express.json())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())

// partial public api
app.use("/auth", AuthRouter)

// private api
app.use("/user", verifyToken, UserRouter)
app.use("/category", verifyToken, CategoryRouter)
app.use("/product", verifyToken, ProductRouter)

// testing api
app.use("/testing", TestingRouter)

// keep connection alive
setInterval(async () => {
    try {
        await pool.query("SELECT 1")
        console.log("Keep-alive query sent")
    } catch (error) {
        console.error("Keep-alive query failed:", error)
    }
}, 300000) // Every 5 minutes

app.listen(3333, () => {
    console.clear()
    console.log("server started at :3333")
})
