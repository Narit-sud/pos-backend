import { Product } from "../interfaces/Product"
export const validateNewProduct = (newProduct: Product): boolean => {
    if (typeof newProduct.name === "undefined" || newProduct.name === "") {
        throw new Error("product name empty")
    }

    if (typeof newProduct.category === "undefined") {
        throw new Error("product category empty")
    }

    if (typeof newProduct.price === "undefined") {
        throw new Error("product price empty")
    }

    if (typeof newProduct.cost === "undefined") {
        throw new Error("product cost empty")
    }

    if (typeof newProduct.stock === "undefined") {
        throw new Error("product stock empty")
    }

    return true
}
