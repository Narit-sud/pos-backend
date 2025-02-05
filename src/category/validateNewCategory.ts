import { Category } from "../_interfaces/Category";
export const validateNewCategory = (category: Category): boolean => {
    if (
        typeof category.name === "undefined" ||
        typeof category.detail === "undefined"
    ) {
        throw new Error("Category name and detail are required");
    }

    if (category.name.length === 0) {
        throw new Error("Category name cannot be empty");
    }

    return true;
};
