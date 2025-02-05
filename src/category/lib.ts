import { CustomError } from "../_class/CustomError";
import { Category } from "./types";

export function validateNewCategory(newCategory: Category) {
    if (newCategory.name.length === 0 || newCategory.name === "") {
        throw new CustomError("Category name empty", 400);
    }
    if (newCategory.uuid.length === 0 || newCategory.uuid === "") {
        throw new CustomError("Category uuid empty", 400);
    }
}
