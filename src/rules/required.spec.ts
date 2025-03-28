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

        test("Should return true on a non-empty string", async () => {
            const required = new Required();

            const result = await required.validate(mockRequestObject, "content");

            expect(result).toBeTruthy();
        });

        test("Should return false on empty string", async () => {
            const required = new Required();

            const result = await required.validate(mockRequestObject, "title");

            expect(result).toBeFalsy();
        });

        test("Should return an object in case of fail", async () => {
            const required = new Required();

            const result = await required.message("title");

            expect(result).toEqual({ name: "required", message: "The title field is required" })
        });

        test("Should return a custom error message", async () => {
            const required = new Required();

            const result = await required.message("title", "Please fill the required field: {field}");

            expect(result.message).toBe("Please fill the required field: title");
        });

    });

    describe("Array", () => {

        test("Should return true on a non-empty array", async () => {
            const required = new Required();

            const result = await required.validate(mockRequestObject, "tags");

            expect(result).toBeTruthy();
        });

        test("Should return false on an empty array", async () => {
            const required = new Required();

            const result = await required.validate(mockRequestObject, "emptyArray");

            expect(result).toBeFalsy();
        });

    });

    describe("Object", () => {

        test("Should return true on a non-empty object", async () => {
            const required = new Required();

            const result = await required.validate(mockRequestObject, "author");

            expect(result).toBeTruthy();
        });

        test("Should return false on empty object", async () => {
            const required = new Required();

            const result = await required.validate(mockRequestObject, "emptyObject");

            expect(result).toBeFalsy();
        });

    });

    describe("Generic", () => {

        test("Should return a normalized classname", async () => {
            const required = new Required();

            const name = await required.getName();

            expect(name).toBe("required");
        });

        test("Should have a default error message", async () => {
            const required = new Required();

            const error = await required.getError();

            expect(error).toBe("The {field} field is required");
        });

        test("Should return false on undefined", async () => {
            const required = new Required();

            const result = await required.validate(mockRequestObject, "nonExistingProperty");

            expect(result).toBeFalsy();
        });

    });

});
