import { Request, Response } from "express"
import { FalseResponse, TrueResponse } from "../class/Response"
import { Token } from "../utils/token"
import { UserAuth } from "../interfaces/User"
import { userService } from "../services/user"
import { validateNewUser } from "../utils/validateNewUser"
import { loginService, registerService } from "../services/auth"

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
        if (error instanceof Error) {
            if (error.message.includes("not found")) {
                res.status(404).send(new FalseResponse(error.message))
                return
            } else if (error.message.includes("wrong password")) {
                res.status(400).send(new FalseResponse(error.message))
                return
            }
        }
        res.status(500).send(new FalseResponse("unexpected error", error))
        return
    }
}

export const registerHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const newUser = req.body
    try {
        const isUserValid = validateNewUser(newUser)
        if (isUserValid) {
            await registerService(newUser)
            res.status(201).send(new TrueResponse("create new user success"))
            return
        }
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("unique_username")) {
                res.status(400).send(
                    new FalseResponse("this username already taken"),
                )
            } else if (error.message.includes("unique_email")) {
                res.status(400).send(
                    new FalseResponse("this email already taken"),
                )
            } else if (error.message.includes("unique_full_name")) {
                res.status(400).send(
                    new FalseResponse("this pereson already has an account"),
                )
            } else {
                res.status(500).send(new FalseResponse(error.message, error))
                return
            }
        }
    }
}

export const reloginHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { jwt } = req.cookies
    const { username } = (Token.decode(jwt) as UserAuth).user
    try {
        const userData = await userService.getByUsername(username)
        res.status(200).send(
            new TrueResponse(
                `relogin: get auth of user ${username} success`,
                userData.data,
            ),
        )
    } catch (error) {
        console.log(error)
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
