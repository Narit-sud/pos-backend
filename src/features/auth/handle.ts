import { Request, Response } from "express";
import { FalseResponse, TrueResponse } from "../../class/Response";
import { Token } from "../../utils/token";
import { getUserByUsernameService } from "../user/service";
import { validateNewUser } from "./validateNewUser";
import { loginService, registerService } from "./service";
import { CustomError } from "../../class/CustomError";

export const loginHandle = async (
    req: Request,
    res: Response
): Promise<void> => {
    // read login detail and send auth data, set frontend cookies
    const loginDetail = await req.body;
    try {
        await loginService(loginDetail);
        const token = await Token.generate(loginDetail.username);
        res.status(200)
            .cookie("jwt", token, {
                expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            })
            .send(new TrueResponse("login success"));
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message));
            return;
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error));
            return;
        }
    }
};

export const registerHandle = async (
    req: Request,
    res: Response
): Promise<void> => {
    // insert new user into the db
    const newUser = req.body;
    try {
        validateNewUser(newUser);
        await registerService(newUser);
        res.status(201).send(new TrueResponse("Create new user success"));
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message));
            return;
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error));
            return;
        }
    }
};

export const reloginHandle = async (
    req: Request,
    res: Response
): Promise<void> => {
    // read cookie and resend the auth data
    const { jwt } = req.cookies;

    try {
        const decode = Token.decode(jwt);

        const userData = await getUserByUsernameService(decode.username);
        res.status(200).send(
            new TrueResponse(
                `Relogin: get auth of user ${decode.username} success`,
                userData
            )
        );
        return;
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message));
            return;
        } else {
            res.status(500).send(new FalseResponse("Unexpected error", error));
            return;
        }
    }
};

export const logoutHandle = async (
    req: Request,
    res: Response
): Promise<void> => {
    // replace cookies with empty one
    res.status(200)
        .cookie("jwt", "logout", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        })
        .send(new TrueResponse("user logout"));
};
