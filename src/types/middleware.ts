export abstract class Exception extends Error {
    protected _statusCode?: number
    protected _identifier?: string

    constructor(message: string) {
        super(message)
    }


    get statusCode(): number {
        return this._statusCode!
    }

    get identifier(): string {
        return this._identifier!
    }
}

export type Handler<CE = unknown, CC = unknown, CR = unknown> = (event: CE, context: CC) => Promise<CR>
export type ErrorHandler<CE = unknown, CC = unknown, CR = unknown, ERR = Exception> = (event: CE, context: CC, errors: ERR) => Promise<CR>
export type Middleware<CE = unknown, CC = unknown, CR = unknown> = (event: CE, context: CC, response?: CR) => Promise<void>
