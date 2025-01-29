import { Router } from "express";
import { getCategoriesHandle } from "./handle";

export const CategoryRouter = Router();

CategoryRouter.get("/", getCategoriesHandle);
// CategoryRouter.get("/:id", getCategoryByIdHandle);
// CategoryRouter.post("/", createCategoryHandle);
// CategoryRouter.delete("/:id", deleteCategoryHandle);
// CategoryRouter.patch("/:id", updateCategoryHandle);
