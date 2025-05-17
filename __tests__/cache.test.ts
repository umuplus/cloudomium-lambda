import cacheMiddleware from '../src/middlewares/cache'

import assert from 'node:assert/strict'
import { test } from 'node:test'

test('cache middleware simple', async () => {
    const middleware = cacheMiddleware()
    const response: Record<string, any> = { statusCode: 200 }
    await middleware(null, null, response)
    assert.equal(response.headers['Cache-Control'], 'public, max-age=86400')
})

test('cache middleware full', async () => {
    const middleware = cacheMiddleware({
        alwaysCache: true,
        ttl: 3600,
    })
    const response: Record<string, any> = { statusCode: 400 }
    await middleware(null, null, response)
    assert.equal(response.headers['Cache-Control'], 'public, max-age=3600')
})
