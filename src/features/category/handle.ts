import { Request, Response } from "express";
import {
    getAll,
    getByUUID,
    createNew,
    deleteByUUID,
    updateByUUID,
} from "./service";
import { validateNewCategory } from "./validateNewCategory";
import { ApiResponse } from "../../class/Response";
import { CustomError } from "../../class/CustomError";
import { CategoryType } from "./types";

export async function getAllHandle(req: Request, res: Response): Promise<void> {
    try {
        const result = await getAll();
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data, undefined)
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(
                new ApiResponse(true, error.message, undefined, error)
            );
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function getByUUIDHandle(
    req: Request,
    res: Response
): Promise<void> {
    const { uuid } = req.params;
    try {
        const result = await getByUUID(uuid);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data)
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(
                new ApiResponse(true, error.message, undefined, error)
            );
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function updateByUUIDHandle(
    req: Request,
    res: Response
): Promise<void> {
    const updatedCategory = req.body as CategoryType;
    try {
        const result = await updateByUUID(updatedCategory);
        res.status(result.code).send(new ApiResponse(true, result.message));
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(
                new ApiResponse(true, error.message, undefined, error)
            );
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function createNewHandle(
    req: Request,
    res: Response
): Promise<void> {
    const newCategory = req.body;

    try {
        validateNewCategory(newCategory);
        const result = await createNew(newCategory);
        res.status(result.code).send(new ApiResponse(true, result.message));
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
        }
    }
}

export async function deleteCategoryHandle(
    req: Request,
    res: Response
): Promise<void> {
    const { uuid } = req.params;
    try {
        const result = await deleteByUUID(uuid);
        res.status(result.code).send(new ApiResponse(true, result.message));
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
        }
    }
}
