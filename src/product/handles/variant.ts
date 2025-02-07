import { Request, Response } from "express";
import { ApiResponse } from "../../_class/Response";
import { CustomError } from "../../_class/CustomError";
import {
    createVariants,
    deleteVariants,
    getVariants,
    updateVariants,
} from "../services/variant";
import { VariantProductType } from "../types";

export async function getVariantsHandle(
    req: Request,
    res: Response,
): Promise<void> {
    console.log("request to get variants");

    try {
        const result = await getVariants();
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
                new ApiResponse(false, "Unexpected Error", error),
            );
            return;
        }
    }
}

export async function createVariantsHandle(
    req: Request,
    res: Response,
): Promise<void> {
    console.log("request to create variants");

    const variants = req.body as VariantProductType[];
    try {
        const result = await createVariants(variants);
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

export async function updateVariantsHandle(
    req: Request,
    res: Response,
): Promise<void> {
    console.log("request to update variants");

    const variants = req.body as VariantProductType[];
    try {
        const result = await updateVariants(variants);
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

export async function deleteVariantsHandle(
    req: Request,
    res: Response,
): Promise<void> {
    console.log("request to delete variants");

    const variants = req.body as VariantProductType[];
    try {
        const result = await deleteVariants(variants);
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
