export class QueryResult<T = never> {
    message: string;
    code: number;
    data?: T;
    constructor(message: string, code: number, data?: T) {
        this.message = message;
        this.code = code;
        this.data = data;
    }
}
