import languageMiddleware from '../src/middlewares/language'

import assert from 'node:assert/strict'
import { test } from 'node:test'

test('language middleware simple', async () => {
    const middleware = languageMiddleware()
    const context: Record<string, any> = {}
    await middleware({ headers: {} }, context)
    assert.equal(context.language, 'en')
})

test('language middleware with custom default', async () => {
    const middleware = languageMiddleware({ language: 'tr' })
    const context: Record<string, any> = {}
    await middleware({ headers: {} }, context)
    assert.equal(context.language, 'tr')
})

test('language middleware full', async () => {
    const middleware = languageMiddleware({ language: 'tr' })
    const context: Record<string, any> = {}
    await middleware({ headers: { 'x-app-language': 'fr' } }, context)
    assert.equal(context.language, 'fr')
})
