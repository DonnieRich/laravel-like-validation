import { describe, expect, test } from "vitest";
import Numeric from "./Numeric.js";

const mockRequestObject = {
    shortString: "ab",
    longString: "abcdefghijklmno",
    shortArray: [1, 2],
    longArray: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lowNumber: 455,
    highNumber: 1500,
    floatNumber: 1500.5,
    negativeNumber: -1500,
    zeroNumber: 0,
    negativeFloatNumber: -1500.5,
    stringNumber: "1500",
    stringNumberWithSpaces: " 1500 ",
    invalidField: {}
}

describe("Numeric", () => {

    const numericValidator = new Numeric();

    describe("Numbers", () => {

        test("should validate a lowNumber as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "lowNumber");
            expect(result).toBe(true);
        });

        test("should validate a highNumber as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "highNumber");
            expect(result).toBe(true);
        });

        test("should validate a floatNumber as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "floatNumber");
            expect(result).toBe(true);
        });

        test("should validate a negativeNumber as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "negativeNumber");
            expect(result).toBe(true);
        });

        test("should validate a zeroNumber as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "zeroNumber");
            expect(result).toBe(true);
        });

        test("should validate a negativeFloatNumber as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "negativeFloatNumber");
            expect(result).toBe(true);
        });

        test("should invalidate a shortString as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "shortString");
            expect(result).toBe(false);
        });

        test("should invalidate a longString as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "longString");
            expect(result).toBe(false);
        });

        test("should invalidate a shortArray as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "shortArray");
            expect(result).toBe(false);
        });

        test("should invalidate a longArray as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "longArray");
            expect(result).toBe(false);
        });

        test("should invalidate an invalidField as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "invalidField");
            expect(result).toBe(false);
        });

        test("should validate a stringNumber as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "stringNumber");
            expect(result).toBe(true);
        });

        test("should validate a stringNumberWithSpaces as numeric", async () => {
            const result = await numericValidator.validate(mockRequestObject, "stringNumberWithSpaces");
            expect(result).toBe(true);
        });
    });

    describe("Generic", () => {

        test("Should return an object in case of fail", () => {
            const result = numericValidator.message("shortString", "");

            expect(result).toEqual({ name: "numeric", message: "The shortString field must be a number" });
        });

        test("Should return a custom error message", () => {
            const result = numericValidator.message("shortString", "Please, ensure the {field} field is numeric");

            expect(result.message).toEqual("Please, ensure the shortString field is numeric");
        });

        test("Should have a default error message", () => {
            const error = numericValidator.getError();

            expect(error).toBe("The {field} field must be a number");
        });

        test("Should return a normalized classname", () => {
            const name = numericValidator.getName();

            expect(name).toBe("numeric");
        });

    });

});