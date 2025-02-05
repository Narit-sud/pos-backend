import { Router } from "express";
import {
    getAllProductHandle,
    getProductByIdHandle,
    createProductHandle,
    updateProductHandle,
    deleteProductHandle,
    getMainsHandle,
    getVariantsHandle,
    createMainHandle,
    createVariantsHandle,
    createBothHandle,
    deleteMainHandle,
} from "./handle";

export const productRouter = Router();

productRouter.get("/main", getMainsHandle);
productRouter.post("/main", createMainHandle);
productRouter.delete("/main/:uuid", deleteMainHandle);

productRouter.post("/full", createBothHandle);

productRouter.get("/variant", getVariantsHandle);
productRouter.post("/variant", createVariantsHandle);

productRouter.get("/", getAllProductHandle);
productRouter.get("/:id", getProductByIdHandle);
productRouter.post("/", createProductHandle);
productRouter.patch("/:id", updateProductHandle);
productRouter.delete("/:id", deleteProductHandle);
