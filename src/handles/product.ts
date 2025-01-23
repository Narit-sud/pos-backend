import { Request, Response } from "express"
import { TrueResponse, FalseResponse } from "../class/Response"
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/product"
import { Product } from "../interfaces/Product"
import { validateNewProduct } from "../utils/validateNewProduct"
import { CustomError } from "../class/CustomError"

export const getAllProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const products = await getAllProducts()
        res.status(200).send(
            new TrueResponse("Get products data success", products),
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

export const getProductByIdHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params

    try {
        const product = (await getProductById(id)) as Product
        res.status(200).send(
            new TrueResponse<Product>(`Get product id ${id} success`, product),
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

export const createProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const newProduct = req.body
    try {
        validateNewProduct(newProduct)
        await createProduct(newProduct)
        res.status(201).send(new TrueResponse("Create new product success"))
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

export const updateProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const updatedProduct = req.body
    try {
        await updateProduct(updatedProduct)
        res.status(200).send(
            new TrueResponse(`update product id ${updatedProduct.id} success`),
        )
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

export const deleteProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params
    try {
        await deleteProduct(id)
        res.status(200).send(
            new TrueResponse(`delete product id ${id} success`),
        )
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
