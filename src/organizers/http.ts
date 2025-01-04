import { ApiGatewayProxyEvent, ApiGatewayProxyEventV2, ApiGatewayProxyResult, ApiGatewayProxyResultV2 } from '../types/http'
import { CloudomiumLambda } from './_lambda'
import { ErrorHandler, Exception, Handler } from '../types/middleware'
import { LambdaContext } from '../types/lambda'

export class HttpException extends Exception {
    constructor(statusCode = 500, msg?: Error | string) {
        super(msg ? (typeof msg === 'string' ? msg : msg.message) : 'Internal Server Error')

        this._statusCode = statusCode
    }
}

export class HttpNotFoundException extends HttpException {
    constructor(msg?: Error | string) {
        super(404, msg || 'Not Found')
    }
}

export class HttpBadRequestException extends HttpException {
    constructor(msg?: Error | string) {
        super(400, msg || 'Bad Request')
    }
}

export class HttpUnauthorizedException extends HttpException {
    constructor(msg?: Error | string) {
        super(401, msg || 'Unauthorized')
    }
}

export class HttpForbiddenException extends HttpException {
    constructor(msg?: Error | string) {
        super(403, msg || 'Forbidden')
    }
}

export class HttpNotAcceptableException extends HttpException {
    constructor(msg?: Error | string) {
        super(406, msg || 'Not Acceptable')
    }
}

/**
 * Lambda organizer with middleware support for HTTP events
 * @class HttpLambda
 * @template CE - HTTP Request type
 * @template CR - HTTP Response type
 * @template CC - Context type
 * @example new HttpLambda<ApiGatewayProxyEvent, ApiGatewayProxyResult>()
 */
export class HttpLambda<
    CE = ApiGatewayProxyEvent | ApiGatewayProxyEventV2,
    CR = ApiGatewayProxyResult | ApiGatewayProxyResultV2,
    CC = LambdaContext,
> extends CloudomiumLambda<CE, CC, CR> {
    constructor() {
        super()

        this.onError = this.onHttpError as ErrorHandler<CE, CC, CR, HttpException>
    }

    /**
     * Assigns the handler function
     * @param {Handler<CE, CC, CR>} handler - Handler to be executed
     * @returns {Handler<CE, CC, CR>}
     */
    execute(handler: Handler<CE, CC, CR>): Handler<CE, CC, CR> {
        return async (event: CE, context: CC): Promise<CR> => {
            let response = { statusCode: 204 } as CR

            for (const { middleware } of this.onBefore) {
                try {
                    await middleware(event, context)
                } catch (e) {
                    const error = e instanceof HttpException ? e : new HttpException(500, e as Error)
                    return this.onError!(event, context, error)
                }
            }

            try {
                const result = await handler(event, context)
                if (result) response = result
            } catch (e) {
                const error = e instanceof HttpException ? e : new HttpException(500, e as Error)
                return this.onError!(event, context, error)
            }

            for (const { middleware } of this.onAfter) {
                try {
                    await middleware(event, context, response)
                } catch (e) {
                    const error = e instanceof HttpException ? e : new HttpException(500, e as Error)
                    return this.onError!(event, context, error)
                }
            }

            // @ts-ignore
            if (response?.body && typeof response.body !== 'string') response.body = JSON.stringify(response.body)
            return response
        }
    }

    protected async onHttpError(_event: CE, _context: CC, e: HttpException): Promise<CR> {
        return { statusCode: 500, body: JSON.stringify({ name: e.name, message: e.message }) } as CR
    }
}
