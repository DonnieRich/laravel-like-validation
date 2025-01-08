import { describe, expect, test } from "vitest";
import RegexMatch from "./RegexMatch.js";

const mockRequestObject = {
    numbers: "1234",
    string: "fake content",
    goodSlug: "post-title-1",
    badSlug: "post_title-wrong"
}

describe("RegexMatch", () => {

    describe("Numeric", () => {

        test("Should return true when field match the regex pattern [NUMERIC]", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.validate(mockRequestObject, "numbers", "/[0-9]+/g");

            expect(result).toBeTruthy();
        });

        test("Should return false when field does not match the regex pattern [NUMERIC]", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.validate(mockRequestObject, "string", "/[0-9]+/g");

            expect(result).toBeFalsy();
        });

    });


    describe("Characters", () => {

        test("Should return true when field match the regex pattern [CHARACTERS]", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.validate(mockRequestObject, "string", "/[a-zA-Z]+/g");

            expect(result).toBeTruthy();
        });

        test("Should return false when field does not match the regex pattern [CHARACTERS]", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.validate(mockRequestObject, "numbers", "/[a-zA-Z]+/g");

            expect(result).toBeFalsy();
        });

        test("Should return false when field does not match the regex pattern [CHARACTERS UPPERCASE]", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.validate(mockRequestObject, "numbers", "/[A-Z]+/g");

            expect(result).toBeFalsy();
        });

    });

    describe("Slug", () => {

        test("Should return true when field match the regex pattern [SLUG]", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.validate(mockRequestObject, "goodSlug", "/^[a-z0-9]+(?:\-[a-z0-9]*)*$/g");

            expect(result).toBeTruthy();
        });

        test("Should return false when field does not match the regex pattern [SLUG]", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.validate(mockRequestObject, "badSlug", "/^[a-z0-9]+(?:\-[a-z0-9]*)*$/g");

            expect(result).toBeFalsy();
        });

    });


    describe("Generic", () => {

        test("Should return an object in case of fail", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.message("badSlug", "", "/^[a-z0-9]+(?:\-[a-z0-9]*)*$/g");

            expect(result).toEqual({ name: "regex_match", message: "The badSlug value must match the pattern /^[a-z0-9]+(?:\-[a-z0-9]*)*$/g" })
        });

        test("Should return a custom error message", () => {
            const regexMatch = new RegexMatch();

            const result = regexMatch.message("badSlug", "{field} does not match the requested pattern {value}", "/^[a-z0-9]+(?:\-[a-z0-9]*)*$/g");

            expect(result.message).toBe("badSlug does not match the requested pattern /^[a-z0-9]+(?:\-[a-z0-9]*)*$/g");
        });

        test("Should have a default error message", () => {
            const regexMatch = new RegexMatch();

            const error = regexMatch.getError();

            expect(error).toBe("The {field} value must match the pattern {value}");
        });

        test("Should return a normalized classname", () => {
            const regexMatch = new RegexMatch();

            const name = regexMatch.getName();

            expect(name).toBe("regex_match");
        });

    });

});