import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { FalseResponse, TrueResponse } from "../class/Response";
import { Token } from "../utils/token";
import { UserAuth } from "../interfaces/User";
import { userService } from "../services/user";
import { validateNewuser } from "../utils/validateNewUser";
import { authService } from "../services/auth";

export const authHandle = {
    login: async (req: Request, res: Response) => {
        const loginDetail = await req.body;
        try {
            await authService.login(loginDetail);
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
            if (
                error instanceof Error &&
                error.message.includes("wrong password")
            ) {
                res.status(404).send(new FalseResponse(error.message));
                return;
            } else if (
                error instanceof Error &&
                error.message.includes("user not found")
            ) {
                res.status(404).send(new FalseResponse(error.message));
                return;
            }
        }
    },

    register: async (req: Request, res: Response) => {
        const newUser = await req.body;
        const newUserValid = validateNewuser(newUser);
        if (!newUserValid.valid && typeof newUserValid.reason === "string") {
            res.status(400).send(new FalseResponse(newUserValid.reason));
            return;
        }

        const result = await authService.register(newUser);
        console.log(result);

        if (result.success) {
            // create success
            res.status(201).send(new TrueResponse("Register success"));
            return;
        } else if (
            // duplicate username
            typeof result.error === "object" &&
            result.error !== null &&
            "constraint" in result.error &&
            typeof result.error.constraint === "string" &&
            result.error.constraint.includes("employees_unique_full_name")
        ) {
            res.status(400).send(
                new FalseResponse("This person already has an account"),
            );
            return;
        } else if (
            // duplicate username
            typeof result.error === "object" &&
            result.error !== null &&
            "constraint" in result.error &&
            typeof result.error.constraint === "string" &&
            result.error.constraint.includes("employees_unique_username")
        ) {
            res.status(400).send(
                new FalseResponse("This username already taken"),
            );
            return;
        } else if (
            // duplicate username
            typeof result.error === "object" &&
            result.error !== null &&
            "constraint" in result.error &&
            typeof result.error.constraint === "string" &&
            result.error.constraint.includes("employees_unique_email")
        ) {
            res.status(400).send(new FalseResponse("This email already taken"));
            return;
        } else {
            res.status(500).send(
                new FalseResponse("Cannot create new user", result.error),
            );
        }
        return;
    },

    relogin: async (req: Request, res: Response) => {
        const { jwt } = req.cookies;
        const { username } = (Token.decode(jwt) as UserAuth).user;
        try {
            const userData = await userService.getByUsername(username);
            res.status(200).send(
                new TrueResponse(
                    `relogin: get auth of user ${username} success`,
                    userData.data,
                ),
            );
        } catch (error) {
            console.log(error);
        }
    },

    logout: async (req: Request, res: Response) => {
        res.status(200)
            .cookie("jwt", "logout", {
                expires: new Date(Date.now()),
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            })
            .send(new TrueResponse("user logout"));
    },
};
