import { Router } from "express";
import { getAllHandle } from "./handle";

export const ProcurementRouter = Router();

ProcurementRouter.get("/", getAllHandle);
