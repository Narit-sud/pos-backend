export class CustomError extends Error {
    code: number

    constructor(msg: string, code: number) {
        super(msg)
        this.code = code
        this.name = CustomError.name
    }
}
