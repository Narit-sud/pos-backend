import { Request, Response } from "express";
import { categoryService } from "../services/category";
import { TrueResponse, FalseResponse } from "../class/Response";
import { PgError } from "../interfaces/PgError";
import { Category } from "../types/Category";

export const categoryHandle = {
    getAll: async (req: Request, res: Response) => {
        try {
            const result = await categoryService.getAll();
            res.status(200).send(
                new TrueResponse("get category data success", result),
            );
        } catch (error) {
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).send(new FalseResponse(error.message));
                return;
            } else {
                res.status(500).send(
                    new FalseResponse("internal error", error),
                );
                return;
            }
        }
        // if (result.success) {
        //     res.status(200).send(
        //         new TrueResponse(
        //             "get gategory data success",
        //             result.data as Category[],
        //         ),
        //     );
        // } else {
        //     res.status(404).send(new FalseResponse("unexpected error occured"));
        // }
    },
    getById: async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await categoryService.getById(id);
        console.log(result);

        if (result.success) {
            res.status(200).send(
                new TrueResponse(
                    `get categories data id ${id} success`,
                    result.data as Category[],
                ),
            );
        } else {
            const response = new FalseResponse("unexpected error occured");
            res.status(404).send(response);
        }
    },
    delete: async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const isDeleted = await categoryService.delete(id);
            if (isDeleted) {
                const response = new TrueResponse(`category id: ${id} deleted`);
                res.send(response).status(200);
            } else {
                const response = new FalseResponse(
                    `failed to delete category id: ${id} category might not existed`,
                );
                res.send(response).status(400);
            }
        } catch (error) {
            const response = new FalseResponse(
                `failed to delete category id: ${id}`,
                error,
            );
            res.send(response).status(400);
        }
    },
    create: async (req: Request, res: Response) => {
        const newCategory = req.body;
        if (
            typeof newCategory.name === "undefined" &&
            typeof newCategory.detail === "undefined"
        ) {
            const response = new TrueResponse("category name cannot be empty");
            res.status(400).send(response);
        } else if (
            typeof newCategory.name === "string" &&
            newCategory.name.length === 0
        ) {
            const response = new FalseResponse("Category name cannot be empty");
            res.status(400).send(response);
        } else {
            try {
                const isCreated = await categoryService.create(newCategory);
                if (isCreated) {
                    const response = new TrueResponse(
                        "create new category success",
                    );
                    res.status(201).send(response);
                } else {
                    const response = {
                        success: false,
                        message: "unexpected error",
                    };
                    res.status(500).send(response);
                }
            } catch (error) {
                const PgError = error as PgError;
                if (PgError.code === "23505") {
                    const response = new FalseResponse(
                        `${newCategory.name} already existed`,
                    );
                    res.status(400).send(response);
                } else {
                    const response = new FalseResponse(
                        "unexpected error",
                        error,
                    );
                    res.status(400).send(response);
                }
            }
        }
    },
    update: async (req: Request, res: Response) => {
        const { id } = req.params;
        let { name, detail } = req.body;

        if (typeof name === "undefined" && typeof detail === "undefined") {
            const response = new TrueResponse("category name cannot be empty");
            res.send(response).status(400);
            return;
        }
        try {
            if (detail === undefined) {
                detail = "";
            }

            const updatedCategory = {
                id,
                name,
                detail,
            };
            const isUpdated = await categoryService.update(updatedCategory);
            if (isUpdated) {
                const response = new TrueResponse(
                    `success updated category id: ${id}`,
                );
                res.send(response).status(200);
            } else {
                const response = new FalseResponse(
                    `failed to update category id: ${id} category might not existed`,
                );
                res.send(response).status(400);
            }
        } catch (error) {
            const response = new FalseResponse(
                `failed to update category id: ${id}`,
                error,
            );
            res.send(response).status(404);
        }
    },
};
