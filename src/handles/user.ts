import { Request, Response } from "express";
import { userService } from "../services/user";
import { TrueResponse, FalseResponse } from "../utils/class";
import { generateJWT } from "../utils/token";
import { Token } from "../utils/token";

export const userHandle = {
    getAll: async (req: Request, res: Response) => {
        try {
            const data = await userService.getAll();

            if (data.length === 0) {
                // const error = new Error("user not found");
                const response = new FalseResponse("failed to get user data");
                res.status(404).send(response);
            }

            const response = new TrueResponse(
                "success getting users data",
                data,
            );
            res.status(200).send(response);
        } catch (error) {
            const response = new FalseResponse(
                "failed getting users data",
                error,
            );
            res.status(400).send(response);
        }
    },
    getById: async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const data = await userService.getById(id);

            if (data.length === 0) {
                const response = new FalseResponse("user not found");
                res.status(404).send(response);
            }

            const response = new TrueResponse(
                `get user id: ${id} success`,
                data,
            );

            res.status(200).send(response);
        } catch (error) {
            const response = new FalseResponse(
                `failed to get user id ${id} data`,
                error instanceof Error ? error : new Error("Unknown error"),
            );

            res.status(404).send(response);
        }
    },
    create: async (req: Request, res: Response) => {
        const userData = await req.body;

        try {
            const isCreated = await userService.create(userData);
            if (isCreated) {
                const response = new TrueResponse("success creating new user");
                res.status(200).send(response);
            }
        } catch (error) {
            if (error instanceof Error && typeof error.message === "string") {
                if (error.message.includes("unique_full_name")) {
                    // check duplicate first_name, last_name
                    const response = new FalseResponse(
                        "This person already existed",
                    );
                    res.status(400).send(response);
                } else if (error.message.includes("unique_username")) {
                    // check duplicate username
                    const response = new FalseResponse(
                        "This username already existed",
                    );
                    res.status(400).send(response);
                }
            } else {
                // if error is something else
                const response = new FalseResponse("Unexpected error");
                res.status(400).send(response);
            }
        }
    },
    update: async (req: Request, res: Response) => {
        const { id } = req.params;
        const updatedUser = await req.body;

        try {
            const isUpdated = await userService.update({ id, ...updatedUser });

            if (isUpdated) {
                const response = new TrueResponse("success updated user data");
                res.status(200).send(response);
            }
        } catch (error) {
            const response = new FalseResponse("Unexpected error");
            res.status(400).send(response);
        }
    },
    login: async (req: Request, res: Response) => {
        const loginDetail = await req.body;
        try {
            const loginOk = await userService.login(loginDetail);
            if (!loginOk) {
                // if login is not ok, password doesn't matched
                const response = new FalseResponse("Wrong password");
                res.status(401).send(response);
            } else {
                // if password matched
                try {
                    const token = await Token.generate(loginDetail.username);
                    const response = new TrueResponse("login success");
                    console.log("============================");

                    res.status(200)
                        .cookie("jwt", token, {
                            expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            // path: "/",
                        })
                        .send(response);
                } catch (error) {
                    const response = new FalseResponse(
                        "unknown error occured",
                        error,
                    );
                    res.status(400).send(response);
                }
            }
        } catch (error) {
            const response = new FalseResponse("User not found", error);
            res.status(404).send(response);
        }
    },
};
