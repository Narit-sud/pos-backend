import { Router } from "express"
import {
    getAllUserHandle,
    getUserByUsernameHandle,
    updateUserHandle,
} from "../handles/user"

export const UserRouter = Router()

UserRouter.get("/", getAllUserHandle)
UserRouter.get("/:username", getUserByUsernameHandle)
UserRouter.patch("/:id", updateUserHandle)
