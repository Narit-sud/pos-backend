import { Router } from "express";
import { getAllHandle, createHandle } from "./handle";

export const SupplierRouter = Router();

SupplierRouter.get("/", getAllHandle);
SupplierRouter.post("/", createHandle);
