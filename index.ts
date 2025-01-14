import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./src/routers/user";
import { RoleRouter } from "./src/routers/role";
import { CategoryRouter } from "./src/routers/category";
import { ProductRouter } from "./src/routers/product";
import { pool } from "./src/utils/pool";
import { Token } from "./src/utils/token";
import { publicHandle } from "./src/handles/public";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// public api
app.post("/login", publicHandle.login);
app.post("/register", publicHandle.register);
app.post("/verifyToken", publicHandle.verifyToken);

// private api
app.use("/user", Token.verify, UserRouter);
app.use("/role", Token.verify, RoleRouter);
app.use("/category", Token.verify, CategoryRouter);
app.use("/product", Token.verify, ProductRouter);

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
