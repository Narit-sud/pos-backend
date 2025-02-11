import { Request, Response } from "express";
import { CustomError } from "../_class/CustomError";
import { ApiResponse } from "../_class/Response";
import { getAll } from "./service";

export async function getAllHandle(req: Request, res: Response) {
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

export async function updateHandle() {}
export async function createHandle() {}
export async function deleteHandle() {}
