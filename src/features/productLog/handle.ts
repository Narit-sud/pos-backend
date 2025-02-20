import { Request, Response } from "express";
import { ApiResponse } from "../../class/Response";
import {
    createService,
    getAllService,
    updateService,
    deleteByUUIDService,
} from "./service";
import { CustomError } from "../../class/CustomError";
import { ProductLogType } from "./types";

export async function getAllOrderHandle(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const result = await getAllService(true);
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
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function getAllProcurementHandle(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const result = await getAllService(false);
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
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function createOrderLogsHandle(
    req: Request,
    res: Response
): Promise<void> {
    const newLogs = req.body as ProductLogType[];
    try {
        const result = await createService(newLogs, true);
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
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function createProcurementLogsHandle(
    req: Request,
    res: Response
): Promise<void> {
    const newLogs = req.body as ProductLogType[];
    try {
        const result = await createService(newLogs, false);
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
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function updateHandle(req: Request, res: Response): Promise<void> {
    const updatedLogs = req.body as ProductLogType[];
    try {
        const result = await updateService(updatedLogs);
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
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}

export async function deleteHandle(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;
    try {
        const result = await deleteByUUIDService(uuid);
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
                new ApiResponse(false, "Unexpected Error", undefined, error)
            );
            return;
        }
    }
}
