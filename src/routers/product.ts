import { Router } from "express"
import {
    getAllProductHandle,
    getProductByIdHandle,
    createProductHandle,
    updateProductHandle,
    deleteProductHandle,
} from "../handles/product"

export const ProductRouter = Router()

ProductRouter.get("/", getAllProductHandle)
ProductRouter.get("/:id", getProductByIdHandle)
ProductRouter.post("/", createProductHandle)
ProductRouter.patch("/:id", updateProductHandle)
ProductRouter.delete("/:id", deleteProductHandle)
