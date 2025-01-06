import { Router } from "express";
import { productHandle } from "../handles/product";

export const ProductRouter = Router();

ProductRouter.get("/", productHandle.getAll);

ProductRouter.get("/:id", productHandle.getById);

ProductRouter.post("/", productHandle.create);

ProductRouter.delete("/:id", productHandle.delete);

// ProductRouter.patch("/:id", );
