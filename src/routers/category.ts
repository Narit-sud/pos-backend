import { Router } from "express";
import { category } from "../services/category";
import { TrueResponse, FalseResponse } from "../utils/class";
import { PgError } from "../interfaces/PgError";

export const CategoryRouter = Router();

CategoryRouter.get("/", async (req, res) => {
    try {
        const data = await category.getAll();
        if (data) {
            const response = new TrueResponse(
                "get categories data success",
                data,
            );
            res.send(response).status(200);
        } else {
            const response = new FalseResponse("unexpected error occured");
            res.send(response).status(404);
        }
    } catch (error) {
        const response = new FalseResponse(
            "failed to get categories data",
            error,
        );
        res.status(404).send(response);
    }
});

CategoryRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await category.getById(id);
        if (data) {
            const response = new TrueResponse(
                `get categories data id ${id} success`,
                data,
            );
            res.send(response).status(200);
        } else {
            const response = new FalseResponse("unexpected error occured");
            res.status(404).send(response);
        }
    } catch (error) {
        const response = new FalseResponse(
            "failed to get categories data, category might not existed",
        );
        res.status(404).send(response);
    }
});

CategoryRouter.post("/", async (req, res) => {
    const newCategory = req.body;
    if (
        typeof newCategory.name === "undefined" &&
        typeof newCategory.detail === "undefined"
    ) {
        const response = new TrueResponse("category name cannot be empty");
        res.status(400).send(response);
    } else if (
        typeof newCategory.name === "string" &&
        newCategory.name.length === 0
    ) {
        const response = new FalseResponse("Category name cannot be empty");
        res.status(400).send(response);
    } else {
        try {
            const isCreated = await category.create(newCategory);
            if (isCreated) {
                const response = new TrueResponse(
                    "create new category success",
                );
                res.status(201).send(response);
            } else {
                const response = {
                    success: false,
                    message: "unexpected error",
                };
                res.status(500).send(response);
            }
        } catch (error) {
            const PgError = error as PgError;
            if (PgError.code === "23505") {
                const response = new FalseResponse(
                    `${newCategory.name} already existed`,
                );
                res.status(400).send(response);
            } else {
                const response = new FalseResponse("unexpected error", error);
                res.status(400).send(response);
            }
        }
    }
});

CategoryRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const isDeleted = await category.delete(id);
        if (isDeleted) {
            const response = new TrueResponse(`category id: ${id} deleted`);
            res.send(response).status(200);
        } else {
            const response = new FalseResponse(
                `failed to delete category id: ${id} category might not existed`,
            );
            res.send(response).status(400);
        }
    } catch (error) {
        const response = new FalseResponse(
            `failed to delete category id: ${id}`,
            error,
        );
        res.send(response).status(400);
    }
});

CategoryRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;
    let { name, detail } = req.body;

    if (typeof name === "undefined" && typeof detail === "undefined") {
        const response = new TrueResponse("category name cannot be empty");
        res.send(response).status(400);
        return;
    }
    try {
        if (detail === undefined) {
            detail = "";
        }

        const updatedCategory = {
            id,
            name,
            detail,
        };
        const isUpdated = await category.update(updatedCategory);
        if (isUpdated) {
            const response = new TrueResponse(
                `success updated category id: ${id}`,
            );
            res.send(response).status(200);
        } else {
            const response = new FalseResponse(
                `failed to update category id: ${id} category might not existed`,
            );
            res.send(response).status(400);
        }
    } catch (error) {
        const response = new FalseResponse(
            `failed to update category id: ${id}`,
            error,
        );
        res.send(response).status(404);
    }
});
