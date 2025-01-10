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
