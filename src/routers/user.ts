import { Router } from "express";
import { userHandle } from "../handles/user";
import { verifyToken } from "../middlewares/verifyToken";

export const UserRouter = Router();

UserRouter.get("/", verifyToken, userHandle.getAll);

UserRouter.get("/:id", verifyToken, userHandle.getById);

UserRouter.patch("/:id", verifyToken, userHandle.update);
