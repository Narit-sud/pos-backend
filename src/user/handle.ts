import { Request, Response } from "express"
import {
    getAllUserService,
    getUserByIdService,
    getUserByUsernameService,
    updateUserService,
} from "./service"
import { TrueResponse, FalseResponse } from "../_class/Response"
import { CustomError } from "../_class/CustomError"

export const getAllUserHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const users = await getAllUserService()
        if (!users) {
            res.status(404).send(new FalseResponse("no user found"))
            return
        }
        res.status(200).send(new TrueResponse("get users data success", users))
        return
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error))
        }
    }
}

export const getUserByIdHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params
    try {
        const user = await getUserByIdService(id)
        res.status(200).send(
            new TrueResponse(`Get user id ${id} success`, user),
        )
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error))
        }
    }
}

export const getUserByUsernameHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { username } = req.params
    try {
        const user = await getUserByUsernameService(username)
        if (!user) {
            res.status(404).send(new FalseResponse("user not found"))
            return
        }

        res.status(200).send(
            new TrueResponse(
                `Get user from username: ${username} success`,
                user,
            ),
        )
        return
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error))
        }
    }
}

export const updateUserHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params
    const updatedUser = await req.body

    try {
        updateUserService({ id, ...updatedUser })
        res.status(200).send(new TrueResponse(`Update user id ${id} success`))
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error))
        }
    }
}
