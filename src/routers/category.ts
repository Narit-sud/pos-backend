import { Router } from "express";
import { categoryHandle } from "../handles/category";

export const CategoryRouter = Router();

CategoryRouter.get("/", categoryHandle.getAll);

CategoryRouter.get("/:id", categoryHandle.getById);

CategoryRouter.post("/", categoryHandle.create);

CategoryRouter.delete("/:id", categoryHandle.delete);

CategoryRouter.patch("/:id", categoryHandle.update);
