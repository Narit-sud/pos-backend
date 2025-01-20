import { Request, Response } from "express";
import { TrueResponse, FalseResponse } from "../class/Response";
import { productService } from "../services/product";
import { Product } from "../interfaces/Product";
import { validateNewProduct } from "../utils/validateNewProduct";

export const productHandle = {
    getAll: async (req: Request, res: Response) => {
        try {
            const result = await productService.getAll();
            res.status(200).send(
                new TrueResponse("get products data success", result),
            );
            return;
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("not found")) {
                    res.status(404).send(new FalseResponse(error.message));
                    return;
                } else {
                    res.status(400).send(
                        new FalseResponse("fetch failed", error.message),
                    );
                }
            } else {
                res.status(404).send(
                    new FalseResponse("unexpected error", error),
                );
                return;
            }
        }
    },
    getById: async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await productService.getById(id);
        console.log(result);

        if (result.success) {
            const response = new TrueResponse(
                `get product data id: ${id} success`,
                result.data as Product[],
            );
            res.send(response).status(200);
        } else {
            if (result.message.includes("not found")) {
                res.status(404).send(new FalseResponse(result.message));
            } else {
                res.status(500).send(new FalseResponse("unexpected error"));
            }
        }
    },
    create: async (req: Request, res: Response) => {
        const newProduct = req.body;
        const checkNewProduct = validateNewProduct(newProduct);
        if (checkNewProduct.valid) {
            const result = await productService.create(newProduct);

            console.log(result);

            if (result.success) {
                res.status(201).send(
                    new TrueResponse("create new product success"),
                );
            } else if (
                typeof result.error === "object" &&
                result.error !== null &&
                "constraint" in result.error &&
                typeof result.error.constraint === "string" &&
                result.error.constraint.includes("products_unique_name")
            ) {
                res.status(400).send(
                    new FalseResponse("this product already existed"),
                );
            } else {
                const response = new FalseResponse(
                    "unexpected error",
                    result.error,
                );
                res.status(500).send(response);
            }
        } else {
            res.status(400).send(
                new FalseResponse(
                    "some of product detail are missing, please check these required fields: name, category, price, cost, stock",
                ),
            );
        }
    },
    delete: async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const isDeleted = await productService.delete(id);
            if (isDeleted) {
                const response = new TrueResponse(`product id: ${id} deleted`);
                res.send(response).status(200);
            } else {
                const response = new FalseResponse(
                    `failed to delete product id: ${id} product might not existed`,
                );
                res.send(response).status(400);
            }
        } catch (error) {
            const response = new FalseResponse(
                `failed to delete product id: ${id}`,
                error,
            );
            res.send(response).status(400);
        }
    },
    update: async (req: Request, res: Response) => {
        const { id } = req.params;
        const updatedProduct = req.body;

        try {
            const updated = await productService.update(updatedProduct, id);
            if (updated) {
                const response = new TrueResponse("update product success");
                res.status(200).send(response);
            } else {
                const response = new FalseResponse(
                    "failed to updated product, error in update handles",
                );
                res.status(400).send(response);
            }
        } catch (error) {
            console.log(error);
            const response = new FalseResponse("error", error);
            res.status(400).send(response);
        }
    },
    // update:async (req:Request, res:Response) => {
    //     const { id } = req.params;
    //     let { name, detail } = req.body;
    //
    //     if (typeof name === "undefined" && typeof detail === "undefined") {
    //         const response = new TrueResponse("product.name cannot be empty");
    //         res.send(response).status(400);
    //         return;
    //     }
    //     try {
    //         if (detail === undefined) {
    //             detail = "";
    //         }
    //
    //         const updatedproduct.= {
    //             id,
    //             name,
    //             detail,
    //         };
    //         const isUpdated = await product.update(updatedCategory);
    //         if (isUpdated) {
    //             const response = new TrueResponse(
    //                 `success updated product.id: ${id}`,
    //             );
    //             res.send(response).status(200);
    //         } else {
    //             const response = new FalseResponse(
    //                 `failed to update product.id: ${id} product might not existed`,
    //             );
    //             res.send(response).status(400);
    //         }
    //     } catch (error) {
    //         const response = new FalseResponse(
    //             `failed to update product.id: ${id}`,
    //             error,
    //         );
    //         res.send(response).status(404);
    //     }
    // }
};
