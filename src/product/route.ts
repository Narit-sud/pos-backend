import { Router } from "express";
import {
    getAllProductHandle,
    getProductByIdHandle,
    createProductHandle,
    updateProductHandle,
    deleteProductHandle,
    getMainsHandle,
    getVariantsHandle,
} from "./handle";

export const productRouter = Router();

productRouter.get("/main", getMainsHandle);
productRouter.get("/variant", getVariantsHandle);

productRouter.get("/", getAllProductHandle);
productRouter.get("/:id", getProductByIdHandle);
productRouter.post("/", createProductHandle);
productRouter.patch("/:id", updateProductHandle);
productRouter.delete("/:id", deleteProductHandle);
