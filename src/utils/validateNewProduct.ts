import { Product } from "../interfaces/Product";
export const validateNewProduct = (newProduct: Product) => {
    if (typeof newProduct.name === "undefined" || newProduct.name === "") {
        return { valid: false, reason: "product name empty" };
    }

    if (typeof newProduct.category === "undefined") {
        return { valid: false, reason: "product category empty" };
    }

    if (typeof newProduct.price === "undefined") {
        return { valid: false, reason: "product price empty" };
    }

    if (typeof newProduct.cost === "undefined") {
        return { valid: false, reason: "product cost empty" };
    }

    if (typeof newProduct.stock === "undefined") {
        return { valid: false, reason: "product stock empty" };
    }

    return { valid: true };
};
