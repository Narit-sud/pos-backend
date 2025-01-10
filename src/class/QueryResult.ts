import { PgError } from "../interfaces/PgError";

export class QueryResults<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: T;

    constructor(success: boolean, message: string, data?: T, error?: T) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}

export class TrueResults<T> {
    success: boolean = true;
    message: string;
    data?: T;
    error?: T;
    constructor(message: string, data?: T) {
        this.message = message;
        this.data = data;
    }
}

export class FalseResults<T> {
    success: boolean = false;
    message: string;
    error?: T;
    data?: T;
    constructor(message: string, error?: T) {
        this.message = message;
        this.error = error;
    }
}
