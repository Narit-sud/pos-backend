import { Request, Response } from "express";
import { CustomError } from "../../../class/CustomError";
import { ApiResponse } from "../../../class/Response";
import { FullProductType } from "../types";
import { createNew, deleteFull, getFull } from "../services/full";

export async function getFullHandle(
    req: Request,
    res: Response
): Promise<void> {
    console.log("request to get full products");
    try {
        const fullProducts = await getFull();
        res.status(200).send(
            new ApiResponse(true, "Get products success", fullProducts)
        );
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);
            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function createFullHandle(
    req: Request,
    res: Response
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
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function deleteFullHandle(
    req: Request,
    res: Response
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
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}
