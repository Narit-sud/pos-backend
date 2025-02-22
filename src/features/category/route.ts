import { Router } from "express";
import {
    getAllHandle,
    getByUUIDHandle,
    createHandle,
    deleteHandle,
    updateHandle,
} from "./handle";

export const categoryRouter = Router();

categoryRouter.get("/", getAllHandle); // get all
categoryRouter.get("/:uuid", getByUUIDHandle); // get by uuid
categoryRouter.post("/", createHandle); // create
categoryRouter.put("/:uuid", updateHandle); // update
categoryRouter.delete("/:uuid", deleteHandle); // delete
