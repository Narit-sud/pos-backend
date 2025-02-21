import { Request, Response } from "express";
import { getAllService } from "./service";
import { ApiResponse } from "../../class/Response";
import { CustomError } from "../../class/CustomError";

export async function getAllHandle(req: Request, res: Response): Promise<void> {
    try {
        const result = await getAllService();
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
