import { PgError } from "../interfaces/PgError";
import { Product } from "../interfaces/Product";

export class ApiResponse<T> {
    success: boolean = true;
    message: string;
    data?: T[];

    constructor(message: string = "get data success", data?: T[]) {
        this.message = message;
        this.data = data;
    }
}

export class ApiErrorResponse<E extends Error = Error> {
    success: boolean = false;
    message: string;
    error?: E;

    constructor(
        message: string = "cannot get data",
        error: E = new Error("error fetching data") as E,
    ) {
        this.message = message;
        this.error = error;
    }
}
