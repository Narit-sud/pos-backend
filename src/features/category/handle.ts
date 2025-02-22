import { Request, Response } from "express";
import {
    getAllService,
    getByUUIDService,
    createNewService,
    deleteService,
    updateService,
} from "./service";
import { validateNewCategory } from "./validateNewCategory";
import { ApiResponse } from "../../class/Response";
import { CustomError } from "../../class/CustomError";
import { CategoryType } from "./types";

export async function getAllHandle(req: Request, res: Response): Promise<void> {
    try {
        const result = await getAllService();
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

export async function getByUUIDHandle(
    req: Request,
    res: Response,
): Promise<void> {
    const { uuid } = req.params;
    try {
        const result = await getByUUIDService(uuid);

        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
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

export async function updateHandle(req: Request, res: Response): Promise<void> {
    const updatedCategory = req.body as CategoryType;
    try {
        const result = await updateService(updatedCategory);
        res.status(result.code).send(new ApiResponse(true, result.message));
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

export async function createHandle(req: Request, res: Response): Promise<void> {
    const newCategory = req.body;

    try {
        validateNewCategory(newCategory);
        const result = await createNewService(newCategory);
        console.log(result);
        res.status(result.code).send(new ApiResponse(true, result.message));
    } catch (error) {
        console.log(error);
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
        }
    }
}

export async function deleteHandle(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;
    try {
        const result = await deleteService(uuid);
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
