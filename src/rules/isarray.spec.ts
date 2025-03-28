import { describe, it, expect } from 'vitest';
import IsArray from './IsArray.js';

const mockRequestObject = {
    shortString: "ab",
    longString: "abcdefghijklmno",
    shortArray: [1, 2],
    longArray: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    emptyArray: [],
    lowNumber: 455,
    highNumber: 1500,
    emptyObject: {},
    symbol: Symbol("test"),
    nullValue: null,
    functionValue: () => { },
    fakeArray: { length: 4 },
}

describe('isArray', () => {
    it('should return true for an array', async () => {
        const isArray = new IsArray();
        expect(await isArray.validate(mockRequestObject, "shortArray")).toBe(true);
        expect(await isArray.validate(mockRequestObject, "emptyArray")).toBe(true);
    });

    it('should return false for non-array values', async () => {
        const isArray = new IsArray();
        expect(await isArray.validate(mockRequestObject, "longString")).toBe(false);
        expect(await isArray.validate(mockRequestObject, "symbol")).toBe(false);
        expect(await isArray.validate(mockRequestObject, "lowNumber")).toBe(false);
        expect(await isArray.validate(mockRequestObject, "emptyObject")).toBe(false);
        expect(await isArray.validate(mockRequestObject, "undefinedProps")).toBe(false);
        expect(await isArray.validate(mockRequestObject, "nullValue")).toBe(false);
    });

    it('should return false for functions', async () => {
        const isArray = new IsArray();
        expect(await isArray.validate(mockRequestObject, "functionValue")).toBe(false);
    });

    it('should return false for objects with array-like properties', async () => {
        const isArray = new IsArray();
        expect(await isArray.validate(mockRequestObject, "fakeArray")).toBe(false);
    });
});