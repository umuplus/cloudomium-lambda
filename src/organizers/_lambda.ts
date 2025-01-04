import { ErrorHandler, Exception, Middleware } from '../types/middleware'

/**
 * Lambda organizer with middleware support
 * @class CloudomiumLambda
 * @template CE - Lambda Event
 * @template CC - Context type
 * @template CR - Response type
 */
export abstract class CloudomiumLambda<CE = unknown, CC = unknown, CR = unknown> {
    protected _metadata: Record<string, any> = {}
    protected onBefore: Array<{ middleware: Middleware<CE, CC, CR> }> = []
    protected onAfter: Array<{ middleware: Middleware<CE, CC, CR> }> = []
    protected onError?: ErrorHandler<CE, CC, CR, Exception>

    /**
     * Assigns metadata configuration to the organizer.
     * If no value is provided, it returns the current value.
     * @param {string} key - Configuration key
     * @param {any} value - Configuration value
     * @returns {CloudomiumLambda<CE = unknown, CC = unknown, CR = unknown> | any}
     */
    metadata(key: string, value?: any): this | any {
        if (!value) return this._metadata[key as string]

        this._metadata[key as string] = value
        return this
    }

    /**
     * Adds a middleware to be executed before the handler
     * @param {Middleware<CE, CC, CR>} middleware - Middleware to be executed
     * @returns {CloudomiumLambda<CE = unknown, CC = unknown, CR = unknown>}
     */
    before(middleware: Middleware<CE, CC, CR>): this {
        this.onBefore.push({ middleware })
        return this
    }

    /**
     * Adds a middleware to be executed after the handler
     * @param {Middleware<CE, CC, CR>} middleware - Middleware to be executed
     * @returns {CloudomiumLambda<CE = unknown, CC = unknown, CR = unknown>}
     */
    after(middleware: Middleware<CE, CC, CR>): this {
        this.onAfter.push({ middleware })
        return this
    }

    /**
     * Assigns the error handler function
     * @param {ErrorHandler<CE, CC, CR, Exception>} handler - Error handler to be executed when an error occurs
     * @returns {CloudomiumLambda<CE = unknown, CC = unknown, CR = unknown>}
     */
    error(handler: ErrorHandler<CE, CC, CR, Exception>): this {
        this.onError = handler
        return this
    }
}
