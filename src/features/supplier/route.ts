import { Router } from "express";
import { getAllHandle } from "./handle";

export const SupplierRouter = Router();

SupplierRouter.get("/", getAllHandle);
