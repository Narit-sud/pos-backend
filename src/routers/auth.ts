import { Router } from "express";
import { Token } from "../utils/token";
import { authHandle } from "../handles/auth";

export const AuthRouter = Router();

AuthRouter.post("/login", authHandle.login);
AuthRouter.post("/register", authHandle.register);
AuthRouter.get("/relogin", Token.verify, authHandle.relogin);
AuthRouter.post("/logout", Token.verify, authHandle.logout);
AuthRouter.post("/verifyToken", authHandle.verifyToken);
AuthRouter.get("/testCookie", authHandle.testCookie);
