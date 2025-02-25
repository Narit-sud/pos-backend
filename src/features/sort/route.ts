import { Router } from "express";
import { swapCategoryIndexHandle, swapMainIndexHandle } from "./handle";

export const SortRouter = Router();

SortRouter.put("/category", swapCategoryIndexHandle);
SortRouter.put("/main", swapMainIndexHandle);
