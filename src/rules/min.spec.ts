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

        test("Should return false if shorter than 3 characters", async () => {
            const min = new Min();

            const result = await min.validate(mockRequestObject, "shortString", "3");

            expect(result).toBeFalsy();
        });

        test("Should return true if longer than 6 characters", async () => {
            const min = new Min();

            const result = await min.validate(mockRequestObject, "longString", "6");

            expect(result).toBeTruthy();
        });

    });

    describe("Array", () => {

        test("Should return false if it has less than 3 items", async () => {
            const min = new Min();

            const result = await min.validate(mockRequestObject, "shortArray", "3");

            expect(result).toBeFalsy();
        });

        test("Should return true if it has more than 6 items", async () => {
            const min = new Min();

            const result = await min.validate(mockRequestObject, "longArray", "6");

            expect(result).toBeTruthy();
        });

    });

    describe("Number", () => {

        test("Should return false if lower than 1000", async () => {
            const min = new Min();

            const result = await min.validate(mockRequestObject, "lowNumber", "1000");

            expect(result).toBeFalsy();
        });

        test("Should return true if higher than 1000", async () => {
            const min = new Min();

            const result = await min.validate(mockRequestObject, "highNumber", "1000");

            expect(result).toBeTruthy();
        });

    });

    describe("Generic", () => {

        test("Should return an object in case of fail", async () => {
            const min = new Min();

            const result = await min.message("shortString", "", "1");

            expect(result).toEqual({ name: "min", message: "The shortString must have a min length of 1" })
        });

        test("Should return a custom error message", async () => {
            const min = new Min();

            const result = await min.message("shortString", "Please, ensure the {field} field has a length of more than {value} characters", "1");

            expect(result.message).toEqual("Please, ensure the shortString field has a length of more than 1 characters");
        });


        test("Should return false if invalid field", async () => {
            const min = new Min();

            const result = await min.validate(mockRequestObject, "invalidField", "1");

            expect(result).toBeFalsy();
        });

        test("Should have a default error message for invalid fields", async () => {
            const min = new Min();

            min.validate(mockRequestObject, "invalidField", "1");
            const result = await min.message("invalidField", "", "1");

            expect(result.message).toEqual("The field under validation (invalidField) must be of type: Array, String or Number")

        });

        test("Should have a default error message for invalid values", async () => {
            const min = new Min();

            min.validate(mockRequestObject, "lowNumber", "abc");
            const result = await min.message("lowNumber", "", "abc");

            expect(result.message).toEqual("The value expected for the validation must be a number. The value provided is: abc")

        });

        test("Should have a default error message", async () => {
            const min = new Min();

            const error = await min.getError();

            expect(error).toBe("The {field} must have a min length of {value}");
        });

        test("Should return a normalized classname", async () => {
            const min = new Min();

            const name = await min.getName();

            expect(name).toBe("min");
        });

    });

});