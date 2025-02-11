import { Router } from "express";
import {
    createOrderLogsHandle,
    createProcurementLogsHandle,
    deleteHandle,
    getAllOrderHandle,
    getAllProcurementHandle,
    updateHandle,
} from "./handle";

export const productLogRouter = Router();

// order product logs
productLogRouter.get("/order", getAllOrderHandle);
productLogRouter.post("/order", createOrderLogsHandle);

// procurement product logs
productLogRouter.get("/procurement", getAllProcurementHandle);
productLogRouter.post("/procurement", createProcurementLogsHandle);

// both product logs
productLogRouter.put("/", updateHandle);
productLogRouter.delete("/", deleteHandle);
