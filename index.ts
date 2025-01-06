import "dotenv/config";
import express from "express";
import cors from "cors";
import { UserRouter } from "./src/routers/user";
import { RoleRouter } from "./src/routers/role";
import { CategoryRouter } from "./src/routers/category";
import { ProductRouter } from "./src/routers/product";
import { verifyToken } from "./src/middlewares/verifyToken";
import { userHandle } from "./src/handles/user";
import { pool } from "./src/utils/pool";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", verifyToken, UserRouter);
app.use("/role", verifyToken, RoleRouter);
app.use("/category", verifyToken, CategoryRouter);
app.use("/product", verifyToken, ProductRouter);
app.post("/login", userHandle.login);
app.post("/register", userHandle.create);

setInterval(async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Keep-alive query sent");
    } catch (error) {
        console.error("Keep-alive query failed:", error);
    }
}, 300000); // Every 5 minutes

app.listen(3333, () => {
    console.log("server started at :3333");
});
