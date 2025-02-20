import { Router } from "express";
import {
    getAllHandle,
    updateHandle,
    createHandle,
    deleteHandle,
} from "./handle";

export const orderRouter = Router();

orderRouter.get("/", getAllHandle);
orderRouter.post("/", createHandle);
orderRouter.put("/", updateHandle);
orderRouter.delete("/", deleteHandle);
