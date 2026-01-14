import { describe, expect, test } from 'vitest'
import BaseRule from '../../src/base/BaseRule'

class ExposedRule extends BaseRule {
    async validate() {
        return true
    }

    message(field: string, message: string) {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }

    public callParse(value: any) {
        return this.parseValue(value)
    }
}

describe('BaseRule.parseValue', () => {
    test('returns empty array for null and undefined', () => {
        const r = new ExposedRule()
        expect(r.callParse(null)).toEqual([])
        expect(r.callParse(undefined)).toEqual([])
    })

    test('returns array for array values', () => {
        const r = new ExposedRule()
        expect(r.callParse([])).toEqual([])
        expect(r.callParse([1, 2])).toEqual([1, 2])
        expect(r.callParse(['1', '2'])).toEqual(['1', '2'])
    })

    test('returns stringified value for non-string non-array values', () => {
        const r = new ExposedRule()
        expect(r.callParse(123)).toEqual(['123'])
        expect(r.callParse(true)).toEqual(['true'])
        expect(r.callParse({ a: 1 })).toEqual(['[object Object]'])
    })
})
