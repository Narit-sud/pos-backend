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

export class TrueResponse<T> {
    success: boolean = true;
    message: string;
    data?: T[];
    token?: any;

    constructor(message: string, data?: T[], token?: any) {
        this.message = message;
        this.data = data;
        this.token = token;
    }
}

export class FalseResponse<T> {
    success: boolean = false;
    message: string;
    error?: T;
    constructor(message: string, error?: T) {
        this.message = message;
        this.error = error;
    }
}
