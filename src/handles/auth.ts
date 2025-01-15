import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { FalseResponse, TrueResponse } from "../class/Response";
import { Token } from "../utils/token";
import { UserAuth } from "../interfaces/User";
import { userService } from "../services/user";
import { validateNewuser } from "../utils/validateNewUser";

export const authHandle = {
    login: async (req: Request, res: Response) => {
        const loginDetail = await req.body;
        const checkLogin = await userService.login(loginDetail);
        console.log(checkLogin);

        if (checkLogin && !checkLogin.success) {
            // if login is not ok, password doesn't matched
            res.status(401).send(new FalseResponse(checkLogin.message));
            return;
        }

        // if password matched
        const result = await userService.getAuth(
            loginDetail.username as string,
        );
        console.log(result);

        if (!result.success) {
            res.status(500).send(new FalseResponse(result.message));
            return;
        }

        const token = await Token.generate(result.data);
        res.status(200)
            .cookie("jwt", token, {
                expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            })
            .send(new TrueResponse(result.message, result.data));
    },

    register: async (req: Request, res: Response) => {
        const userData = await req.body;
        const newUserValid = validateNewuser(userData);
        if (!newUserValid.valid && typeof newUserValid.reason === "string") {
            res.status(400).send(new FalseResponse(newUserValid.reason));
            return;
        }

        const result = await userService.create(userData);
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

    verifyToken: (req: Request, res: Response) => {
        const { token } = req.body;
        if (!token) {
            res.status(401).send(new FalseResponse("No token provided"));
            return;
        }

        try {
            const secretKey = process.env.JWT_SECRET;
            if (!secretKey) {
                throw new Error("SECRET KEY IS UNDEFINED");
            }

            const decode = jwt.verify(token, secretKey);
            if (!decode) {
                throw new Error("Invalid token");
            }

            res.status(200).send(new TrueResponse("Token valid"));
        } catch (error) {
            const response = new FalseResponse("Invalid token");
            res.status(403).send(response);
        }
    },

    testCookie: (req: Request, res: Response) => {
        console.log(req.cookies);
        res.status(200).send(req.cookies);
    },

    relogin: async (req: Request, res: Response) => {
        const { jwt } = req.cookies;
        const { username } = (Token.decode(jwt) as UserAuth).user;
        const authData = await userService.getAuth(username);
        res.status(200).send(
            new TrueResponse(
                `relogin: get auth of user ${username} success`,
                authData.data,
            ),
        );
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
