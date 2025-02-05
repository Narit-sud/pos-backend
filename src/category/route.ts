import { Router } from "express";
import { getCategoriesHandle, createCategoryHandle } from "./handle";

export const categoryRouter = Router();

categoryRouter.get("/", getCategoriesHandle);
categoryRouter.post("/", createCategoryHandle);
// CategoryRouter.get("/:id", getCategoryByIdHandle);
// CategoryRouter.post("/", createCategoryHandle);
// CategoryRouter.delete("/:id", deleteCategoryHandle);
// CategoryRouter.patch("/:id", updateCategoryHandle);
