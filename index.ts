import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./src/user/route";
import { categoryRouter } from "./src/category/route";
import { productRouter } from "./src/product/route";
import { pool } from "./src/_utils/pool";
import { AuthRouter } from "./src/auth/route";
import { TestingRouter } from "./src/testing/route";
import { verifyToken } from "./src/_middlewares/verifyToken";
import { customerRouter } from "./src/customer/route";
import { orderRouter } from "./src/order/route";
import { productLogRouter } from "./src/productLog/route";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://192.168.1.64:5173",
            "http://localhost:3000",
        ],
        credentials: true,
    }),
);
app.use(cookieParser());

// partial public api
app.use("/auth", AuthRouter);

// private api
app.use("/user", verifyToken, UserRouter);
app.use("/category", verifyToken, categoryRouter);
app.use("/product", verifyToken, productRouter);
app.use("/customer", verifyToken, customerRouter);
app.use("/order", verifyToken, orderRouter);
app.use("/productLog", verifyToken, productLogRouter);

// testing api
app.use("/testing", TestingRouter);

// keep connection alive
setInterval(async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Keep-alive query sent");
    } catch (error) {
        console.error("Keep-alive query failed:", error);
    }
}, 300000); // Every 5 minutes

app.listen(3333, () => {
    console.clear();
    console.log("server started at :3333");
});
