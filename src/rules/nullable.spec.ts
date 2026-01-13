import { describe, expect, test } from "vitest";
import Nullable from "./Nullable.js";

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
    invalidField: {},
    nullField: null,
    objectField: {
        data: "data"
    },
    zeroValueField: 0
}

describe("Nullable", () => {

    describe("Mixed values", () => {

        test("Should pass if field is null", () => {
            const nullableValidator = new Nullable();
            const result = nullableValidator.validate(mockRequestObject, "nullField");
            expect(result).toBe(true);
        })

        test("Should pass if field has data", () => {
            const nullableValidator = new Nullable();
            const result = nullableValidator.validate(mockRequestObject, "objectField");
            expect(result).toBe(true);
        })

        test("Should pass if field has zero value", () => {
            const nullableValidator = new Nullable();
            const result = nullableValidator.validate(mockRequestObject, "zeroValueField");
            expect(result).toBe(true);
        })

        test("Should fail if field is undefined", () => {
            const nullableValidator = new Nullable();
            const result = nullableValidator.validate(mockRequestObject, "undefinedField");
            expect(result).toBe(false);
        })
    })


    describe("Generic", () => {
        test("Should return an object in case of fail", () => {
            const nullableValidator = new Nullable();
            const result = nullableValidator.message("shortString", "");

            expect(result).toEqual({ name: "nullable", message: "The shortString field may be null" });
        });

        test("Should return a custom error message", () => {
            const nullableValidator = new Nullable();
            const result = nullableValidator.message("shortString", "Please, ensure the {field} field is null or has value");

            expect(result.message).toEqual("Please, ensure the shortString field is null or has value");
        });

        test("Should have a default error message", () => {
            const nullableValidator = new Nullable();
            const error = nullableValidator.getError();

            expect(error).toBe("The {field} field may be null");
        });

        test("Should return a normalized classname", () => {
            const nullableValidator = new Nullable();
            const name = nullableValidator.getName();

            expect(name).toBe("nullable");
        });
    })

})