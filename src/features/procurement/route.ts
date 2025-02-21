import { Router } from "express";
import { createHandle, getAllHandle } from "./handle";

export const ProcurementRouter = Router();

ProcurementRouter.get("/", getAllHandle);
ProcurementRouter.post("/", createHandle);
