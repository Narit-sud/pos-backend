import { Router } from "express"
import {
    getAllCategoryHandle,
    getCategoryByIdHandle,
    createCategoryHandle,
    updateCategoryHandle,
    deleteCategoryHandle,
} from "../handles/category"

export const CategoryRouter = Router()

CategoryRouter.get("/", getAllCategoryHandle)
CategoryRouter.get("/:id", getCategoryByIdHandle)
CategoryRouter.post("/", createCategoryHandle)
CategoryRouter.delete("/:id", deleteCategoryHandle)
CategoryRouter.patch("/:id", updateCategoryHandle)
