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

export const getAllProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const products = await getAllProducts()
        res.status(200).send(
            new TrueResponse("get products data success", products),
        )
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("not found")) {
                res.status(404).send(new FalseResponse(error.message))
                return
            } else {
                res.status(400).send(
                    new FalseResponse("fetch failed", error.message),
                )
            }
        } else {
            res.status(404).send(new FalseResponse("unexpected error", error))
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
        if (!product) {
            res.status(404).send(new FalseResponse("product not found"))
            return
        }

        res.status(200).send(
            new TrueResponse<Product>(`get product id ${id} success`, product),
        )
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("not found")) {
                res.status(404).send(new FalseResponse(error.message))
                return
            } else {
                res.status(500).send(
                    new FalseResponse("unexpected error", error),
                )
            }
        }
    }
}

export const createProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const newProduct = req.body
    try {
        const isProductValid = validateNewProduct(newProduct)
        if (isProductValid) {
            await createProduct(newProduct)
            res.status(201).send("create new product success")
            return
        }
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("empty")) {
                res.status(400).send(new FalseResponse(error.message))
                return
            } else {
                res.status(500).send(new FalseResponse(error.message))
            }
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
        if (error instanceof Error) {
            res.status(400).send(new FalseResponse(error.message))
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
        if (error instanceof Error) {
            if (error.message.includes("existed")) {
                res.status(404).send(new FalseResponse(error.message))
                return
            } else {
                res.status(500).send(
                    new FalseResponse("unexpected error", error),
                )
                return
            }
        }
    }
}
