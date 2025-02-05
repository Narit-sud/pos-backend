import { Router } from "express";
import {
    getCategoriesHandle,
    getCategoryByUUID,
    createCategoryHandle,
    deleteCategoryHandle,
} from "./handle";

export const categoryRouter = Router();

// get all categories
categoryRouter.get("/", getCategoriesHandle);
// get a category by uuid
categoryRouter.get("/:uuid", getCategoryByUUID);
// create new category
categoryRouter.post("/", createCategoryHandle);
// delete a category
categoryRouter.delete("/:uuid", deleteCategoryHandle);
