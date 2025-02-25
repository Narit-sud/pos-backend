import { Request, Response } from "express";
import { CustomError } from "../../class/CustomError";
import { ApiResponse } from "../../class/Response";
import { swapCategoryIndexService, swapMainIndexService } from "./service";

export async function swapCategoryIndexHandle(
    req: Request,
    res: Response,
): Promise<void> {
    const [cat1UUID, cat2UUID] = req.body;
    try {
        const result = await swapCategoryIndexService(cat1UUID, cat2UUID);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected error", error),
            );
            return;
        }
    }
}

export async function swapMainIndexHandle(
    req: Request,
    res: Response,
): Promise<void> {
    const [main1UUID, main2UUID] = req.body;
    try {
        const result = await swapMainIndexService(main1UUID, main2UUID);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            res.status(500).send(
                new ApiResponse(false, "Unexpected error", error),
            );
            return;
        }
    }
}
