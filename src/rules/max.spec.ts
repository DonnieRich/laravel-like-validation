import { describe, it, expect } from "vitest";
import Max from "./Max.js";


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
};

describe("Max Rule", () => {
    it("should validate strings within the max length", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "shortString", "5");
        expect(result).toBe(true);
    });

    it("should invalidate strings exceeding the max length", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "longString", "5");
        expect(result).toBe(false);
    });

    it("should validate arrays within the max length", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "shortArray", "3");
        expect(result).toBe(true);
    });

    it("should invalidate arrays exceeding the max length", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "longArray", "5");
        expect(result).toBe(false);
    });

    it("should validate numbers less than or equal to the max value", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "lowNumber", "1000");
        expect(result).toBe(true);
    });

    it("should invalidate numbers greater than the max value", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "highNumber", "1000");
        expect(result).toBe(false);
    });

    it("should validate empty arrays", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "emptyArray", "0");
        expect(result).toBe(true);
    });

    it("should invalidate objects that are not arrays or strings", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "emptyObject", "5");
        expect(result).toBe(false);
    });

    it("should invalidate symbols", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "symbol", "5");
        expect(result).toBe(false);
    });

    it("should invalidate null values", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "nullValue", "5");
        expect(result).toBe(false);
    });

    it("should invalidate functions", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "functionValue", "5");
        expect(result).toBe(false);
    });

    it("should invalidate objects", async () => {
        const rule = new Max();
        const result = await rule.validate(mockRequestObject, "fakeArray", "5");
        expect(result).toBe(false);
    });
});
