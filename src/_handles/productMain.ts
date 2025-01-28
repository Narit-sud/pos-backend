import { Request, Response } from "express"
import {
    createSingleProductMainService,
    getAllProductMainService,
    getProductMainByUUIDService,
} from "../services/productMain"
import { FalseResponse, TrueResponse } from "../_class/Response"
import { CustomError } from "../_class/CustomError"

export const getAllProductMainHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const result = await getAllProductMainService()
        res.status(result.code).send(
            new TrueResponse(result.message, result.data),
        )
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
        } else {
            res.status(500).send(new FalseResponse("Unexpected Error", error))
        }
    }
}

export const getProductMainByUUIDHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { uuid } = req.params
    try {
        const result = await getProductMainByUUIDService(uuid)
        res.status(result.code).send(
            new TrueResponse(result.message, result.data),
        )
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
        } else {
            res.status(500).send(new FalseResponse("Unexpected Error", error))
        }
    }
}

export const createProductMainHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const newProductMain = req.body
    try {
        const result = await createSingleProductMainService(newProductMain)
        res.status(result.code).send(
            new TrueResponse(result.message, result.data),
        )
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
        } else {
            res.status(500).send(new FalseResponse("Unexpected Error", error))
        }
    }
}
