import { Router } from "express";
import { createFullHandle, deleteFullHandle } from "./handles/full";
import { getMainsHandle, updateMainHandle } from "./handles/main";
import {
    createVariantsHandle,
    deleteVariantsHandle,
    getVariantsHandle,
    updateVariantsHandle,
} from "./handles/variant";

export const productRouter = Router();

// full product route
productRouter.post("/", createFullHandle); // create main and variants
productRouter.delete("/:uuid", deleteFullHandle); // delete main and variants

// main product route
productRouter.get("/main", getMainsHandle); // get all
productRouter.put("/main/:uuid", updateMainHandle); // update

// variant product route
productRouter.get("/variant", getVariantsHandle); // get all
productRouter.post("/variant", createVariantsHandle); // create
productRouter.put("/variant", updateVariantsHandle); // update
productRouter.patch("/variant", deleteVariantsHandle); // delete
