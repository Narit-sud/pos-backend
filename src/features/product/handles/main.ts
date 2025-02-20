import { Request, Response } from "express";
import { ApiResponse } from "../../../class/Response";
import { getMains, updateMain } from "../services/main";
import { CustomError } from "../../../class/CustomError";

export async function getMainsHandle(req: Request, res: Response) {
    console.log("request to get mains");

    try {
        const result = await getMains();
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data)
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", error)
            );
            return;
        }
    }
}

export async function updateMainHandle(req: Request, res: Response) {
    console.log("request to update main");

    const mainProduct = req.body;
    try {
        const result = await updateMain(mainProduct);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data)
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", error)
            );
            return;
        }
    }
}
