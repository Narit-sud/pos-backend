import { Request, Response } from "express"
import { getAllCategories } from "../services/productCategory"
import { FalseResponse, TrueResponse } from "../_class/Response"
import { CustomError } from "../_class/CustomError"

export async function getAllCategiresHandle(req: Request, res: Response) {
    try {
        const result = await getAllCategories()
        res.status(result.code).send(
            new TrueResponse(result.message, result.data),
        )
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(error.message)
        } else {
            res.status(500).send(new FalseResponse("Unexpected Error", error))
        }
    }
}
