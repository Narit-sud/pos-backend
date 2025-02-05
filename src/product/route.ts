import { Router } from "express";
import {
    createNewProductHandle,
    getMainsHandle,
    getVariantsHandle,
    createVariantsHandle,
    deleteMainHandle,
} from "./handle";

export const productRouter = Router();

// create new product
productRouter.post("/", createNewProductHandle);

// get all main products
productRouter.get("/main", getMainsHandle);
//get a main product by uuid
//TODO: new route not sure is this necessary?

// delete main product by uuid
productRouter.delete("/main/:uuid", deleteMainHandle);

// get all variant products
productRouter.get("/variant", getVariantsHandle);
// get a variant by uuid
// TODO: new route not sure is this necessary?

// create variant products
productRouter.post("/variant", createVariantsHandle);
