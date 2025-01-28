import { Request, Response } from "express"
import { TrueResponse, FalseResponse } from "../_class/Response"
import { CustomError } from "../_class/CustomError"
import {
    getAllVariants,
    getVariantsByMainUUID,
} from "../services/productVariant"

export const getAllVariantsHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const result = await getAllVariants()
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

export const getVariantsByMainUUIDHandle = async (
    req: Request,
    res: Response,
) => {
    const { uuid } = req.params
    try {
        const result = await getVariantsByMainUUID(uuid)
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
