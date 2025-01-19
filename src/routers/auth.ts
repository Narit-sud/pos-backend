import { Router } from "express";
import { Token } from "../utils/token";
import { authHandle } from "../handles/auth";
import { verifyToken } from "../middlewares/verifyToken";

export const AuthRouter = Router();

AuthRouter.post("/login", authHandle.login);
AuthRouter.post("/register", authHandle.register);

AuthRouter.get("/relogin", verifyToken, authHandle.relogin);
AuthRouter.post("/logout", verifyToken, authHandle.logout);
