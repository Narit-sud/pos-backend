import { Request, Response } from "express";
import {
    getMainService,
    getVariantsService,
    createVariantsService,
    deleteMainService,
    createNewProductService,
} from "./service";
import { CustomError } from "../_class/CustomError";
import { ApiResponse, FalseResponse, TrueResponse } from "../_class/Response";
import { FullProduct } from "./types";

export async function createNewProductHandle(req: Request, res: Response) {
    const fullProduct = req.body as FullProduct;

    try {
        await createNewProductService(fullProduct);
        res.status(201).send(
            new ApiResponse(
                true,
                "Create new product main and variants success",
            ),
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

export const getMainsHandle = async (req: Request, res: Response) => {
    try {
        const result = await getMainService();
        res.status(result.code).send(
            new TrueResponse(result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(new FalseResponse("Unexpected Error", error));
            return;
        }
    }
};

export const getVariantsHandle = async (req: Request, res: Response) => {
    try {
        const result = await getVariantsService();
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
};

export const createVariantsHandle = async (req: Request, res: Response) => {
    const variants = req.body;
    try {
        const result = await createVariantsService(variants);
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
};

export async function deleteMainHandle(req: Request, res: Response) {
    const { uuid } = req.params;
    try {
        await deleteMainService(uuid);
        res.status(200).send(
            new ApiResponse(true, `Delete product with uuid = ${uuid} success`),
        );
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
