import { Request, Response } from "express"
import { FalseResponse, TrueResponse } from "../_class/Response"
import { Token } from "../_utils/token"
import { getUserByUsernameService } from "../user/service"
import { validateNewUser } from "./validateNewUser"
import { loginService, registerService } from "./service"
import { CustomError } from "../_class/CustomError"

export const loginHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const loginDetail = await req.body
    try {
        await loginService(loginDetail)
        const token = await Token.generate(loginDetail.username)
        res.status(200)
            .cookie("jwt", token, {
                expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            })
            .send(new TrueResponse("login success"))
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
            return
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error))
            return
        }
    }
}

export const registerHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const newUser = req.body
    try {
        validateNewUser(newUser)
        await registerService(newUser)
        res.status(201).send(new TrueResponse("Create new user success"))
        return
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
            return
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error))
            return
        }
    }
}

export const reloginHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { jwt } = req.cookies

    try {
        const decode = Token.decode(jwt)

        const userData = await getUserByUsernameService(decode.username)
        res.status(200).send(
            new TrueResponse(
                `Relogin: get auth of user ${decode.username} success`,
                userData,
            ),
        )
        return
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message))
            return
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error))
            return
        }
    }
}

export const logoutHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    res.status(200)
        .cookie("jwt", "logout", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        })
        .send(new TrueResponse("user logout"))
}
