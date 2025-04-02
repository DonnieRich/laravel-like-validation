import { describe, expect, it } from "vitest";
import PresentIf from "./PresentIf.js";

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
    invalidField: {},
    field: "value",
    booleanField: true,
    booleanFieldFalse: false,
}

describe("PresentIf", () => {

    describe("Check fields", () => {

        it("Should pass validation when the condition is met", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field", "shortString,ab");

            expect(result).toBe(true);
        });

        it("Should pass validation when the condition is not met and the field is present", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field", "shortString,xyz");

            expect(result).toEqual(true);
        });

        it("Should pass validation when the field is present and condition is met", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field", "shortString,ab");

            expect(result).toBe(true);
        });

        it("Should fail validation when the field is missing and condition is met", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "missingField", "shortString,ab");

            expect(result).toEqual(false);
        });

        it("Should pass validation when the condition field does not exist", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field", "nonExistentField,value");

            expect(result).toBe(true);
        });

        it("Should handle numeric conditions correctly", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field", "lowNumber,455");

            expect(result).toBe(true);
        });

        it("Should pass validation for numeric conditions when value does not match", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field", "lowNumber,999");

            expect(result).toBe(true);
        });

        it("Should fail validation for numeric conditions when value does not match", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "missingField", "lowNumber,999");

            expect(result).toBe(true);
        });

        it("Should handle fluent conditions correctly - validation is passing", async () => {
            const presentIf = new PresentIf();

            presentIf.field("shortArray").value([1, 2]);

            const result = await presentIf.validate(mockRequestObject, "field");

            expect(result).toBe(true);
        });

        it("Should handle fluent conditions correctly - validation is failing", async () => {
            const presentIf = new PresentIf();

            presentIf.field("shortArray").value([1, 2]);

            const result = await presentIf.validate(mockRequestObject, "missingField");

            expect(result).toBe(false);
        });

        it("Should return false if value is not passed", async () => {
            const presentIf = new PresentIf();

            presentIf.field("shortArray");

            const result = await presentIf.validate(mockRequestObject, "field");

            expect(result).toBe(true);
        });

        it("Should return true if field is not passed", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field");

            expect(result).toBe(true);
        });

        it("Should pass validation for array conditions when value does not match and field is missing", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "missingField", "shortArray,[3,4]");

            expect(result).toEqual(true);
        });

        it("Should handle boolean conditions correctly", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field", "booleanField,true");

            expect(result).toBe(true);
        });

        it("Should pass validation for boolean conditions when value does not match", async () => {
            const presentIf = new PresentIf();

            const result = await presentIf.validate(mockRequestObject, "field", "booleanFieldFalse,true");

            expect(result).toBe(true);
        });
    });

    describe("Generic", () => {

        it("Should return an object in case of fail", () => {
            const presentIf = new PresentIf();

            const result = presentIf.message("field", "", "fieldToCheck,valueToCheck");

            expect(result).toEqual({ name: "present_if", message: "The field field must be present if the field fieldToCheck has a value of valueToCheck" });
        });

        it("Should return a custom error message", () => {
            const presentIf = new PresentIf();

            const result = presentIf.message("field", "{field} must be present when {fieldToCheck} is {valueToCheck}", "fieldToCheck,valueToCheck");

            expect(result.message).toBe("field must be present when fieldToCheck is valueToCheck");
        });

        it("Should have a default error message", () => {
            const presentIf = new PresentIf();

            const error = presentIf.getError();

            expect(error).toBe("The {field} field must be present if the field {fieldToCheck} has a value of {valueToCheck}");
        });

        it("Should return a normalized classname", () => {
            const presentIf = new PresentIf();

            const name = presentIf.getName();

            expect(name).toBe("present_if");
        });

    });
});