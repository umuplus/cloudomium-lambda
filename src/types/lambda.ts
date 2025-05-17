export interface LambdaContext extends Record<string, any> {
    callbackWaitsForEmptyEventLoop?: boolean
    claims?: Record<string, any>
    language: string
}
