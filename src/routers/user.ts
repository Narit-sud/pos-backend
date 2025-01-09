import { Router } from "express";
import { userHandle } from "../handles/user";
import { Token } from "../utils/token";

export const UserRouter = Router();

UserRouter.get("/", Token.verify, userHandle.getAll);

UserRouter.get("/:id", Token.verify, userHandle.getById);

UserRouter.patch("/:id", Token.verify, userHandle.update);
