import { Request, Response } from "express";
import { CustomError } from "../../_class/CustomError";
import { ApiResponse } from "../../_class/Response";
import { FullProductType } from "../types";
import { createNew, deleteFull } from "../services/full";

export async function createFullHandle(
    req: Request,
    res: Response,
): Promise<void> {
    console.log("request to create full");

    const fullProduct = req.body as FullProductType;
    try {
        const result = await createNew(fullProduct);
        res.status(result.code).send(new ApiResponse(true, result.message));
        return;
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

export async function deleteFullHandle(
    req: Request,
    res: Response,
): Promise<void> {
    console.log("request to delete full");
    const { uuid } = req.params;
    try {
        const result = await deleteFull(uuid);
        res.status(result.code).send(new ApiResponse(true, result.message));
        return;
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
