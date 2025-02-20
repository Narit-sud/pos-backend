import { Router } from "express";
import {
    createHandle,
    deleteHandle,
    getAllHandle,
    updateHandle,
} from "./handle";

export const customerRouter = Router();

customerRouter.get("/", getAllHandle); // get all
customerRouter.post("/", createHandle); // create
customerRouter.put("/:uuid", updateHandle); // update
customerRouter.delete("/:uuid", deleteHandle); // delete
