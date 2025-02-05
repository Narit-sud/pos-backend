import { Request, Response } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getMainService,
    getVariantsService,
    createVariantsService,
    createMainService,
    deleteMainService,
} from "./service";
import { validateNewProduct } from "./validateNewProduct";
import { CustomError } from "../_class/CustomError";
import { ApiResponse, FalseResponse, TrueResponse } from "../_class/Response";
import { Product } from "../_interfaces/Product";
import { FullProduct } from "./types";

export const getAllProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const products = await getAllProducts();
        res.status(200).send(
            new TrueResponse("Get products data success", products),
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

export const getProductByIdHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    try {
        const product = (await getProductById(id)) as Product;
        res.status(200).send(
            new TrueResponse<Product>(`Get product id ${id} success`, product),
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

export const createProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const newProduct = req.body;
    try {
        validateNewProduct(newProduct);
        await createProduct(newProduct);
        res.status(201).send(new TrueResponse("Create new product success"));
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

export const updateProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const updatedProduct = req.body;
    try {
        await updateProduct(updatedProduct);
        res.status(200).send(
            new TrueResponse(`update product id ${updatedProduct.id} success`),
        );
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

export const deleteProductHandle = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = req.params;
    try {
        await deleteProduct(id);
        res.status(200).send(
            new TrueResponse(`delete product id ${id} success`),
        );
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

export const getMainsHandle = async (req: Request, res: Response) => {
    try {
        const result = await getMainService();
        res.status(result.code).send(
            new TrueResponse(result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new FalseResponse(error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(new FalseResponse("Unexpected Error", error));
            return;
        }
    }
};
export const createMainHandle = async (req: Request, res: Response) => {
    const main = req.body;
    try {
        const result = await createMainService(main);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", error),
            );
            return;
        }
    }
};

export const getVariantsHandle = async (req: Request, res: Response) => {
    try {
        const result = await getVariantsService();
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", error),
            );
            return;
        }
    }
};
export const createVariantsHandle = async (req: Request, res: Response) => {
    const variants = req.body;
    try {
        const result = await createVariantsService(variants);
        res.status(result.code).send(
            new ApiResponse(true, result.message, result.data),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
            return;
        }
    }
};

export async function createBothHandle(req: Request, res: Response) {
    const main = req.body as FullProduct;
    const { variants } = main;
    console.log(main);

    try {
        await createMainService(main);
        await createVariantsService(variants);
        res.status(201).send(
            new ApiResponse(
                true,
                "Create new product main and variants success",
            ),
        );
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.code).send(new ApiResponse(false, error.message));
            return;
        } else {
            console.log(error);

            res.status(500).send(
                new ApiResponse(false, "Unexpected Error", undefined, error),
            );
            return;
        }
    }
}

export async function deleteMainHandle(req: Request, res: Response) {
    const { uuid } = req.params;
    try {
        await deleteMainService(uuid);
    } catch (error) {}
}
