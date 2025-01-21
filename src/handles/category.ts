import { Request, Response } from "express"
import {
    createCategoryService,
    deleteCategoryService,
    getAllCategoryService,
    getCategoryByIdService,
    updateCategoryService,
} from "../services/category"
import { validateNewCategory } from "../utils/validateNewCategory"
import { TrueResponse, FalseResponse } from "../class/Response"

export const getAllCategoryHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const categories = await getAllCategoryService()
        if (!categories) {
            res.status(404).send(new FalseResponse("no category data found"))
            return
        }
        res.status(200).send(
            new TrueResponse("get category data success", categories),
        )
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("not found")) {
                res.status(404).send(new FalseResponse(error.message))
                return
            } else {
                res.status(400).send(new FalseResponse(error.message))
                return
            }
        }
    }
}

export const getCategoryByIdHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params
    try {
        const category = await getCategoryByIdService(id)
        if (!category) {
            throw new Error(`category id ${id} not found`)
        }

        res.status(200).send(
            new TrueResponse(`get category id ${id} success`, category),
        )
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("doesn't existed")) {
                res.status(404).send(new FalseResponse(error.message))
                return
            } else {
                res.status(500).send(new FalseResponse(error.message))
                return
            }
        }
    }
}

export const createCategoryHandle = async (req: Request, res: Response) => {
    const newCategory = req.body
    try {
        validateNewCategory(newCategory)
        await createCategoryService(newCategory)
        res.status(201).send(new TrueResponse("Create new category success"))
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("failed")) {
                res.status(400).send(new FalseResponse(error.message))
                return
            } else {
                res.status(500).send(new FalseResponse(error.message))
                return
            }
        }
    }
}
export const updateCategoryHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params
    const category = req.body
    try {
        await updateCategoryService(category)
        res.status(200).send(
            new TrueResponse(`update category id ${id} success`),
        )
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("failed")) {
                res.status(400).send(new FalseResponse(error.message))
                return
            } else {
                res.status(500).send(new FalseResponse(error.message))
                return
            }
        }
    }
}
export const deleteCategoryHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params
    try {
        await deleteCategoryService(id)
        res.status(200).send(
            new TrueResponse(`delete category id ${id} success`),
        )
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("doesn't existed")) {
                res.status(404).send(new FalseResponse(error.message))
                return
            } else {
                res.status(500).send(new FalseResponse(error.message))
                return
            }
        }
    }
}
