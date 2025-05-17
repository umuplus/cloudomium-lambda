interface CloudomiumLanguageMiddlewareConfig {
    language?: string
}

export default function (config?: CloudomiumLanguageMiddlewareConfig) {
    return async (event: any, context: any): Promise<any> => {
        const defaultLanguage = config?.language || 'en'
        try {
            const { headers } = event
            const language = headers['x-app-language'] || defaultLanguage
            context.language = language
        } catch (e) {
            context.language = defaultLanguage
        }
    }
}
