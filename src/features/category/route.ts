import { Router } from "express";
import {
    getAllHandle,
    getByUUIDHandle,
    createNewHandle,
    deleteCategoryHandle,
    updateByUUIDHandle,
} from "./handle";

export const categoryRouter = Router();

categoryRouter.get("/", getAllHandle); // get all
categoryRouter.get("/:uuid", getByUUIDHandle); // get by uuid
categoryRouter.post("/", createNewHandle); // create
categoryRouter.put("/:uuid", updateByUUIDHandle); // update
categoryRouter.delete("/:uuid", deleteCategoryHandle); // delete
