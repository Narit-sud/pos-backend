import { Response, Request } from "express";
import { ApiResponse } from "../../class/Response";
import { CustomError } from "../../class/CustomError";
import { createNew, deleteByUUID, getAll, updateByUUID } from "./service";
import { CustomerType } from "./types";

export async function getAllHandle(req: Request, res: Response): Promise<void> {
    try {
        const result = await getAll();
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data)
        );
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected error", error)
            );
            return;
        }
    }
}

export async function updateHandle(req: Request, res: Response): Promise<void> {
    const updatedCustomer = req.body as CustomerType;

    try {
        const result = await updateByUUID(updatedCustomer);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data)
        );
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected error", error)
            );
            return;
        }
    }
}

export async function createHandle(req: Request, res: Response): Promise<void> {
    const newCustomer = req.body;
    try {
        const result = await createNew(newCustomer);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data)
        );
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected error", error)
            );
            return;
        }
    }
}

export async function deleteHandle(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;
    try {
        const result = await deleteByUUID(uuid);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data)
        );
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected error", error)
            );
            return;
        }
    }
}
