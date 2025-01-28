import { Router } from "express"
import { getAllCategiresHandle } from "../_handles/productCategory"

export const productCategoryRouter = Router()

productCategoryRouter.get("/", getAllCategiresHandle)
