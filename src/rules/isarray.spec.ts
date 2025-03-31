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

    describe('Array', () => {
        it('should return true for an array', async () => {
            const isArray = new IsArray();
            expect(await isArray.validate(mockRequestObject, "shortArray")).toBe(true);
            expect(await isArray.validate(mockRequestObject, "emptyArray")).toBe(true);
        });
    });

    describe('Non-array', () => {
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

    describe("Generic", () => {

        it("Should return an object in case of fail", () => {
            const isArray = new IsArray();
            const result = isArray.message("shortString", "");

            expect(result).toEqual({ name: "is_array", message: "The shortString field must be an array" });
        });

        it("Should return a custom error message", () => {
            const isArray = new IsArray();
            const result = isArray.message("shortString", "Please, ensure the {field} field is an array");

            expect(result.message).toEqual("Please, ensure the shortString field is an array");
        });

        it("Should have a default error message", () => {
            const isArray = new IsArray();
            const error = isArray.getError();

            expect(error).toBe("The {field} field must be an array");
        });

        it("Should return a normalized classname", () => {
            const isArray = new IsArray();
            const name = isArray.getName();

            expect(name).toBe("is_array");
        });

    });

});