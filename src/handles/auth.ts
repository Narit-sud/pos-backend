import { Request, Response } from "express"
import { FalseResponse, TrueResponse } from "../class/Response"
import { Token } from "../utils/token"
import { getUserByUsernameService } from "../services/user"
import { validateNewUser } from "../utils/validateNewUser"
import { loginService, registerService } from "../services/auth"
import { CustomError } from "../class/CustomError"

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
