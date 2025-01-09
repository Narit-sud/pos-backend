import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./src/routers/user";
import { RoleRouter } from "./src/routers/role";
import { CategoryRouter } from "./src/routers/category";
import { ProductRouter } from "./src/routers/product";
import { userHandle } from "./src/handles/user";
import { pool } from "./src/utils/pool";
import { Token } from "./src/utils/token";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use("/user", Token.verify, UserRouter);
app.use("/role", Token.verify, RoleRouter);
app.use("/category", Token.verify, CategoryRouter);
app.use("/product", Token.verify, ProductRouter);
app.post("/login", userHandle.login);
app.post("/register", userHandle.create);
app.get("/testCookie", async (req, res) => {
    const cookie = await req.cookies;
    console.log(cookie);
    const resp = { success: true, ck: cookie };

    res.status(200).send(resp);
});

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
