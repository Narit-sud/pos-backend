import { Request, Response } from "express";
import { CustomError } from "../_class/CustomError";
import { ApiResponse } from "../_class/Response";
import { createService, deleteService, getAll, updateService } from "./service";
import { OrderType } from "./types";

export async function getAllHandle(req: Request, res: Response): Promise<void> {
    try {
        const result = await getAll();
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
            return;
        }
    }
}

export async function updateHandle(req: Request, res: Response): Promise<void> {
    const updatedOrder = req.body as OrderType;
    try {
        const result = await updateService(updatedOrder);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
            return;
        }
    }
}
export async function createHandle(req: Request, res: Response): Promise<void> {
    const newOrder = req.body as OrderType;
    try {
        const result = await createService(newOrder);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
            return;
        }
    }
}
export async function deleteHandle(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;
    try {
        const result = await deleteService(uuid);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
            return;
        }
    }
}
