import { Request, Response } from "express";
import { userService } from "../services/user";
import { TrueResponse, FalseResponse } from "../class/Response";
import { User } from "../interfaces/User";

export const userHandle = {
    getAll: async (req: Request, res: Response) => {
        const result = await userService.getAll();
        console.log(result);

        if (result.success && result.data) {
            res.status(200).send(
                new TrueResponse(
                    "success geting users data",
                    result.data as User[],
                ),
            );
        } else {
            res.status(404).send(
                new FalseResponse("failed getting users data"),
            );
        }
    },

    getById: async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await userService.getById(id);
        console.log(result);

        if (result.success && result.data) {
            res.status(200).send(
                new TrueResponse(
                    `success getting user id: ${id} data`,
                    result.data,
                ),
            );
        } else {
            if (result.message.includes("doesn't exited")) {
                res.status(404).send(new FalseResponse(result.message));
            } else {
                res.status(500).send(
                    new FalseResponse("unexpected error getting user by id"),
                );
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
};
