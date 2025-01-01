import { describe, expect, test } from "vitest";
import Required from "./Required.js"

const mockRequestObject = {
    title: "",
    content: "fake content",
    tags: ["html", "js", "css"],
    emptyArray: [],
    author: {
        name: "John",
        date: "2024-10-06"
    },
    emptyObject: {}
}

describe("Required", () => {

    describe("String", () => {

        test("Should return true on a non-empty string", () => {
            const required = new Required();

            const result = required.validate(mockRequestObject, "content");

            expect(result).toBeTruthy();
        });

        test("Should return false on empty string", () => {
            const required = new Required();

            const result = required.validate(mockRequestObject, "title");

            expect(result).toBeFalsy();
        });

        test("Should return an object in case of fail", () => {
            const required = new Required();

            const result = required.message("title");

            expect(result).toEqual({ name: "required", message: "The title field is required" })
        });

        test("Should return a custom error message", () => {
            const required = new Required();

            const result = required.message("title", "Please fill the required field: {field}");

            expect(result.message).toBe("Please fill the required field: title");
        });

    });

    describe("Array", () => {

        test("Should return true on a non-empty array", () => {
            const required = new Required();

            const result = required.validate(mockRequestObject, "tags");

            expect(result).toBeTruthy();
        });

        test("Should return false on an empty array", () => {
            const required = new Required();

            const result = required.validate(mockRequestObject, "emptyArray");

            expect(result).toBeFalsy();
        });

    });

    describe("Object", () => {

        test("Should return true on a non-empty object", () => {
            const required = new Required();

            const result = required.validate(mockRequestObject, "author");

            expect(result).toBeTruthy();
        });

        test("Should return false on empty object", () => {
            const required = new Required();

            const result = required.validate(mockRequestObject, "emptyObject");

            expect(result).toBeFalsy();
        });

    });

    describe("Generic", () => {

        test("Should return a normalized classname", () => {
            const required = new Required();

            const name = required.getName();

            expect(name).toBe("required");
        });

        test("Should have a default error message", () => {
            const required = new Required();

            const error = required.error;

            expect(error).toBe("The {field} field is required");
        });

        test("Should return false on undefined", () => {
            const required = new Required();

            const result = required.validate(mockRequestObject, "nonExistingProperty");

            expect(result).toBeFalsy();
        });

    });

});
