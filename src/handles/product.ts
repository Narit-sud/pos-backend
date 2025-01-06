import { Request, Response } from "express";
import { TrueResponse, FalseResponse } from "../utils/class";
import { productService } from "../services/product";
import { PgError } from "../interfaces/PgError";
export const productHandle = {
    getAll: async (req: Request, res: Response) => {
        try {
            const data = await productService.getAll();
            if (data) {
                const response = new TrueResponse(
                    "get products data success",
                    data,
                );
                res.send(response).status(200);
            } else {
                const response = new FalseResponse("unexpected error occured");
                res.send(response).status(404);
            }
        } catch (error) {
            const response = new FalseResponse(
                "failed to get products data",
                error,
            );
            res.send(response).status(404);
        }
    },
    getById: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const data = await productService.getById(id);
            if (data) {
                const response = new TrueResponse(
                    `get product data id: ${id} success`,
                    data,
                );
                res.send(response).status(200);
            } else {
                const response = new FalseResponse("unexpected error occured");
                res.send(response).status(404);
            }
        } catch (error) {
            const response = new FalseResponse(
                `failed to get product id: ${id} data,this product might not existed`,
            );
            res.send(response).status(404);
        }
    },
    create: async (req: Request, res: Response) => {
        const newProduct = req.body;

        if (typeof newProduct.name === "undefined" || newProduct.name === "") {
            const response = new FalseResponse("product name cannot be empty");
            res.send(response).status(400);
            return;
        } else if (
            typeof newProduct.category === "undefined" ||
            newProduct.category === ""
        ) {
            const response = new FalseResponse(
                "product category cannot be empty",
            );
            res.send(response).status(400);
            return;
        } else if (
            typeof newProduct.recommend_price === "undefined" ||
            newProduct.recommend_price === ""
        ) {
            const response = new FalseResponse("product price cannot be empty");
            res.send(response).status(400);
            return;
        } else if (
            typeof newProduct.current_cost === "undefined" ||
            newProduct.current_cost === ""
        ) {
            const response = new FalseResponse("product cost cannot be empty");
            res.send(response).status(400);
            return;
        } else if (
            typeof newProduct.current_stock === "undefined" ||
            newProduct.current_stock === ""
        ) {
            const response = new FalseResponse("product stock cannot be empty");
            res.send(response).status(400);
        } else {
            try {
                const isCreated = await productService.create(newProduct);
                if (isCreated) {
                    const response = new TrueResponse(
                        "create new product success",
                    );
                    res.send(response).status(201);
                } else {
                    const response = {
                        success: false,
                        message: "unexpected error",
                    };
                    res.send(response).status(500);
                }
            } catch (error) {
                const PgError = error as PgError;
                if (PgError.code === "23505") {
                    const response = new FalseResponse(
                        `${newProduct.name} already existed`,
                    );
                    res.send(response).status(400);
                } else {
                    const response = new FalseResponse(
                        "unexpected error",
                        error,
                    );
                    res.send(response).status(400);
                }
            }
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
