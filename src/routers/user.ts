import { Router } from "express"
import {
    getAllUserHandle,
    getUserByIdHandle,
    getUserByUsernameHandle,
    updateUserHandle,
} from "../handles/user"

export const UserRouter = Router()

UserRouter.get("/", getAllUserHandle)
UserRouter.get("/:id", getUserByIdHandle)
UserRouter.get("/username/:username", getUserByUsernameHandle)
UserRouter.patch("/:id", updateUserHandle)
