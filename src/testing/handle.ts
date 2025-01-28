import { Request, Response } from "express"
import { FalseResponse, TrueResponse } from "../_class/Response"
import { testingGetAllProductIncludeProductMainAndVariant } from "./service"
import { CustomError } from "../_class/CustomError"

export const testingHandle = {
    testCookie: (req: Request, res: Response) => {
        const cookies = req.cookies.jwt
        console.log(cookies)

        if (!cookies) {
            res.status(400).send(new FalseResponse("no cookies provided"))
            return
        } else {
            res.status(200).send(new TrueResponse("cookies provided", cookies))
            return
        }
    },
}

export const testGetAllProductIncludeProductMainAndVariantHandle = async (
    req: Request,
    res: Response,
) => {
    try {
        const result = await testingGetAllProductIncludeProductMainAndVariant()
        res.status(result.code).send(
            new TrueResponse(result.message, result.data),
        )
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message, error))
        } else {
            res.status(500).send(new FalseResponse("Unexpected Error", error))
        }
    }
}
