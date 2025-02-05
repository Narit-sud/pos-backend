import { Request, Response } from "express";
import {
    getCategoriesService,
    createCategoryService,
    deleteCategoryService,
} from "./service";
import { validateNewCategory } from "./validateNewCategory";
import { TrueResponse, FalseResponse, ApiResponse } from "../_class/Response";
import { CustomError } from "../_class/CustomError";

export async function getCategoriesHandle(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const result = await getCategoriesService();
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data, undefined),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(
                new ApiResponse(true, error.message, undefined, error),
            );
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
            return;
        }
    }
}

export async function createCategoryHandle(
    req: Request,
    res: Response,
): Promise<void> {
    const newCategory = req.body;

    try {
        validateNewCategory(newCategory);
        const result = await createCategoryService(newCategory);
        res.status(result.code).send(new ApiResponse(true, result.message));
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
        }
    }
}

export async function deleteCategoryHandle(
    req: Request,
    res: Response,
): Promise<void> {
    const { uuid } = req.params;
    try {
        const result = await deleteCategoryService(uuid);
        res.status(result.code).send(new ApiResponse(true, result.message));
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
        }
    }
}
