import { describe, expect, test } from "vitest";
import Min from "./Min.js";

const mockRequestObject = {
    shortString: "ab",
    longString: "abcdefghijklmno",
    shortArray: [1, 2],
    longArray: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lowNumber: 455,
    highNumber: 1500,
    invalidField: {}
}

describe("Min", () => {

    describe("String", () => {

        test("Should return false if shorter than 3 characters", () => {
            const min = new Min();

            const result = min.validate(mockRequestObject, "shortString", "3");

            expect(result).toBeFalsy();
        });

        test("Should return true if longer than 6 characters", () => {
            const min = new Min();

            const result = min.validate(mockRequestObject, "longString", "6");

            expect(result).toBeTruthy();
        });

    });

    describe("Array", () => {

        test("Should return false if it has less than 3 items", () => {
            const min = new Min();

            const result = min.validate(mockRequestObject, "shortArray", "3");

            expect(result).toBeFalsy();
        });

        test("Should return true if it has more than 6 items", () => {
            const min = new Min();

            const result = min.validate(mockRequestObject, "longArray", "6");

            expect(result).toBeTruthy();
        });

    });

    describe("Number", () => {

        test("Should return false if lower than 1000", () => {
            const min = new Min();

            const result = min.validate(mockRequestObject, "lowNumber", "1000");

            expect(result).toBeFalsy();
        });

        test("Should return true if higher than 1000", () => {
            const min = new Min();

            const result = min.validate(mockRequestObject, "highNumber", "1000");

            expect(result).toBeTruthy();
        });

    });

    describe("Generic", () => {

        test("Should return an object in case of fail", () => {
            const min = new Min();

            const result = min.message("shortString", "", "1");

            expect(result).toEqual({ name: "min", message: "The shortString must have a min length of 1" })
        });

        test("Should return a custom error message", () => {
            const min = new Min();

            const result = min.message("shortString", "Please, ensure the {field} field has a length of more than {value} characters", "1");

            expect(result.message).toEqual("Please, ensure the shortString field has a length of more than 1 characters");
        });


        test("Should return false if invalid field", () => {
            const min = new Min();

            const result = min.validate(mockRequestObject, "invalidField", "1");

            expect(result).toBeFalsy();
        });

        test("Should have a default error message for invalid fields", () => {
            const min = new Min();

            min.validate(mockRequestObject, "invalidField", "1");
            const result = min.message("invalidField", "", "1");

            expect(result.message).toEqual("The field under validation (invalidField) must be of type: Array, String or Number")

        });

        test("Should have a default error message for invalid values", () => {
            const min = new Min();

            min.validate(mockRequestObject, "lowNumber", "abc");
            const result = min.message("lowNumber", "", "abc");

            expect(result.message).toEqual("The value expected for the validation must be a number. The value provided is: abc")

        });

        test("Should have a default error message", () => {
            const min = new Min();

            const error = min.getError();

            expect(error).toBe("The {field} must have a min length of {value}");
        });

        test("Should return a normalized classname", () => {
            const min = new Min();

            const name = min.getName();

            expect(name).toBe("min");
        });

    });

});