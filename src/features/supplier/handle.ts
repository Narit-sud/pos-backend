import { Request, Response } from "express";
import { ApiResponse } from "../../class/Response";
import { CustomError } from "../../class/CustomError";
import { getAll } from "./service";

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
