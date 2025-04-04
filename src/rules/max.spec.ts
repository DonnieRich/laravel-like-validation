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
    floatNumber: 1500.5,
    negativeNumber: -1500,
    negativeFloatNumber: -1500.5,
    zeroNumber: 0,
    emptyObject: {},
    symbol: Symbol("test"),
    nullValue: null,
    functionValue: () => { },
    fakeArray: { length: 4 },
};

describe("Max", () => {

    describe("String", () => {
        it("should validate strings within the max length", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "shortString", "5");
            expect(result).toBe(true);
        });

        it("should invalidate strings exceeding the max length", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "longString", "5");
            expect(result).toBe(false);
        });
    });

    describe("Array", () => {
        it("should validate arrays within the max length", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "shortArray", "3");
            expect(result).toBe(true);
        });

        it("should invalidate arrays exceeding the max length", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "longArray", "5");
            expect(result).toBe(false);
        });

        it("should validate empty arrays", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "emptyArray", "4");
            expect(result).toBe(true);
        });

        it("should validate empty arrays with max as 0", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "emptyArray", "0");
            expect(result).toBe(true);
        });
    });

    describe("Numeric", () => {
        it("should validate numbers less than or equal to the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "lowNumber", "1000");
            expect(result).toBe(true);
        });

        it("should invalidate numbers greater than the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "highNumber", "1000");
            expect(result).toBe(false);
        });

        it("should validate float numbers less than or equal to the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "floatNumber", "2000");
            expect(result).toBe(true);
        });

        it("should invalidate float numbers greater than the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "floatNumber", "1000");
            expect(result).toBe(false);
        });

        it("should validate negative numbers less than or equal to the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "negativeNumber", "-1000");
            expect(result).toBe(true);
        });

        it("should invalidate negative numbers greater than the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "negativeNumber", "-2000");
            expect(result).toBe(false);
        });

        it("should validate negative float numbers less than or equal to the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "negativeFloatNumber", "-1000.5");
            expect(result).toBe(true);
        });

        it("should invalidate negative float numbers greater than the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "negativeFloatNumber", "-2000.5");
            expect(result).toBe(false);
        });

        it("should validate zero as less than or equal to the max value", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "zeroNumber", "0");
            expect(result).toBe(true);
        });

        it("should invalidate zero if the max value is negative", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "zeroNumber", "-1");
            expect(result).toBe(false);
        });
    });

    describe("Non-array, non-string and non-numeric", () => {
        it("should invalidate objects that are not arrays or strings", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "emptyObject", "5");
            expect(result).toBe(false);
        });

        it("should invalidate symbols", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "symbol", "5");
            expect(result).toBe(false);
        });

        it("should invalidate null values", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "nullValue", "5");
            expect(result).toBe(false);
        });

        it("should invalidate functions", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "functionValue", "5");
            expect(result).toBe(false);
        });

        it("should invalidate objects", () => {
            const rule = new Max();
            const result = rule.validate(mockRequestObject, "fakeArray", "5");
            expect(result).toBe(false);
        });
    });

    describe("Generic", () => {
        it("Should return an object in case of fail", () => {
            const max = new Max();
            const result = max.message("shortString", "", "5");

            expect(result).toEqual({ name: "max", message: "The shortString must have a max length of 5" });
        });

        it("Should return a custom error message", () => {
            const max = new Max();
            const result = max.message("shortString", "Please, ensure the {field} field does not exceed {value} characters", "5");

            expect(result.message).toEqual("Please, ensure the shortString field does not exceed 5 characters");
        });

        it("Should have a default error message", () => {
            const max = new Max();
            const error = max.getError();

            expect(error).toBe("The {field} must have a max length of {value}");
        });

        it("Should return a normalized classname", () => {
            const max = new Max();
            const name = max.getName();

            expect(name).toBe("max");
        });
    });

});
