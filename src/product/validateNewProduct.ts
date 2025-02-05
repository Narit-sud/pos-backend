import { CustomError } from "../_class/CustomError";
import { Product } from "../_interfaces/Product";
// this is outdated
export const validateNewProduct = (newProduct: Product): void => {
    if (typeof newProduct.name === "undefined" || newProduct.name === "") {
        throw new CustomError("Invalid product data: name is empty", 400);
    }

    if (typeof newProduct.category === "undefined") {
        throw new CustomError("Invalid product data: category is empty", 400);
    }

    if (typeof newProduct.price === "undefined") {
        throw new CustomError("Invalid product data: price is empty", 400);
    }

    if (typeof newProduct.cost === "undefined") {
        throw new CustomError("Invalid product data: cost is empty", 400);
    }

    if (typeof newProduct.stock === "undefined") {
        throw new CustomError("Invalid product data: stock is empty", 400);
    }
};
