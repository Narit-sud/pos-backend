import { Request, Response } from "express"
import {
    getAllUserService,
    getUserByUsernameService,
    updateUserService,
} from "../services/user"
import { TrueResponse, FalseResponse } from "../class/Response"

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
        if (error instanceof Error) {
            res.status(500).send(new FalseResponse(error.message))
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
                `get user from username: ${username} success`,
                user,
            ),
        )
        return
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(new FalseResponse(error.message))
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
        await updateUserService({ id, ...updatedUser })
        const response = new TrueResponse("success updated user data")
        res.status(200).send(response)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(new FalseResponse(error.message))
        }
    }
}
