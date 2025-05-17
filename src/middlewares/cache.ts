interface CacheMiddlewareConfig {
    alwaysCache?: boolean
    ttl?: number
}

/**
 * Middleware for caching api gateway event
 *
 * @param [config] - Configuration for the middleware
 * @param [config.alwaysCache] - Whether to always cache the response. Otherwise, only cache responses with status code < 300
 * @param [config.ttl] - Time to live for the cache in seconds. Default is 86400 seconds (1 day)
 * @returns A middleware function that caches api gateway event
 */
export default function (config?: CacheMiddlewareConfig) {
    return async (_event: any, _context: any, response: any): Promise<any> => {
        const shouldCache = config?.alwaysCache || response.statusCode < 300
        if (shouldCache) {
            const cacheTTL = config?.ttl || 86400
            response.headers = { ...response.headers, 'Cache-Control': `public, max-age=${cacheTTL}` }
        }
    }
}
