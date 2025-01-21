import { Router } from "express"
import {
    loginHandle,
    registerHandle,
    reloginHandle,
    logoutHandle,
} from "../handles/auth"
import { verifyToken } from "../middlewares/verifyToken"

export const AuthRouter = Router()

// public api
AuthRouter.post("/login", loginHandle)
AuthRouter.post("/register", registerHandle)

// private api
AuthRouter.get("/relogin", verifyToken, reloginHandle)
AuthRouter.post("/logout", verifyToken, logoutHandle)
