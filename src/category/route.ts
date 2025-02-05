import { Router } from "express";
import {
    getCategoriesHandle,
    createCategoryHandle,
    deleteCategoryHandle,
} from "./handle";

export const categoryRouter = Router();

categoryRouter.get("/", getCategoriesHandle);
categoryRouter.post("/", createCategoryHandle);
categoryRouter.delete("/:uuid", deleteCategoryHandle);
