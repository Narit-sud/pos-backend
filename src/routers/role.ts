import { Router } from "express";
import { ApiErrorResponse, ApiResponse } from "../utils/class";
import { role } from "../services/role";
import { Role } from "../types/Role";

export const RoleRouter = Router();

// send all roles data
RoleRouter.get("/", async (req, res) => {
    try {
        const data = await role.getAll();
        if (!data) {
            const response = { success: false, message: "error " };
            res.status(400).send(response);
        } else {
            const response = {
                success: true,
                message: "get roles data success",
                data,
            };
            res.send(response).status(200);
        }
    } catch (error) {
        const response = {
            success: false,
            message: "error getting roles data",
            error,
        };
        res.status(400).send(response);
    }
});

// send role by id
RoleRouter.get("/:id", async (req, res) => {
    // extract id from params
    const { id } = req.params;

    try {
        // start getting data with id
        const data = await role.getById(id);

        // if data is none
        if (data.length === 0) {
            // create error response and return 404 not found
            const response = new ApiErrorResponse("role not found");
            res.status(404).send(response);
        }

        // if data is fine, create success response
        const response = new ApiResponse<Role>(
            `get role id: ${id} success`,
            data,
        );

        // return response with 200 ok
        res.status(200).send(response);
    } catch (error) {
        // if error occur, create error response
        const response = new ApiErrorResponse<Error>(
            `failed to get role id ${id} data`,
            error instanceof Error ? error : new Error("Unknown error"),
        );

        // send error response with 404 not found
        res.status(404).send(response);
    }
});
