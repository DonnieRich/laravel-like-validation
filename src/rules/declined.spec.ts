import { describe, it, expect } from "vitest";
import Declined from "./Declined.js";


const mockRequestObject = {
    boolFalse: false,
    stringFalseLower: "false",
    stringFalseUpper: "FALSE",
    zeroNumber: 0,
    stringZero: "0",
    stringNo: "No",
    stringOffUpper: "OFF",
    boolTrue: true,
    stringTrue: "true",
    numberOne: 1,
    stringYes: "yes",
    stringOn: "on",
    objectValue: { a: 1 },
};

describe("Declined", () => {

    describe("Valid values", () => {
        it("should validate boolean false", async () => {
            const rule = new Declined();
            const result = await rule.validate(mockRequestObject, "boolFalse");
            expect(result).toBe(true);
        });

        it("should validate string 'false' (case-insensitive)", async () => {
            const rule = new Declined();
            const result = await rule.validate(mockRequestObject, "stringFalseUpper");
            expect(result).toBe(true);
        });

        it("should validate number 0", async () => {
            const rule = new Declined();
            const result = await rule.validate(mockRequestObject, "zeroNumber");
            expect(result).toBe(true);
        });

        it("should validate string 'no' and 'off' (case-insensitive)", async () => {
            const rule = new Declined();
            expect(await rule.validate(mockRequestObject, "stringNo")).toBe(true);
            expect(await rule.validate(mockRequestObject, "stringOffUpper")).toBe(true);
        });
    });

    describe("Invalid values", () => {
        it("should invalidate boolean true", async () => {
            const rule = new Declined();
            const result = await rule.validate(mockRequestObject, "boolTrue");
            expect(result).toBe(false);
        });

        it("should invalidate string 'true' and number 1", async () => {
            const rule = new Declined();
            expect(await rule.validate(mockRequestObject, "stringTrue")).toBe(false);
            expect(await rule.validate(mockRequestObject, "numberOne")).toBe(false);
        });

        it("should invalidate 'yes' and 'on'", async () => {
            const rule = new Declined();
            expect(await rule.validate(mockRequestObject, "stringYes")).toBe(false);
            expect(await rule.validate(mockRequestObject, "stringOn")).toBe(false);
        });

        it("should invalidate an object", async () => {
            const rule = new Declined();
            expect(await rule.validate(mockRequestObject, "objectValue")).toBe(false);
        });

        it("should invalidate an undefined value", async () => {
            const rule = new Declined();
            expect(await rule.validate(mockRequestObject, "nonExistingField")).toBe(false);
        });
    });

    describe("Generic", () => {
        it("Should return an object in case of fail", () => {
            const declined = new Declined();
            const result = declined.message("agree", "");

            expect(result).toEqual({ name: "declined", message: "The agree field must be declined" });
        });

        it("Should return a custom error message", () => {
            const declined = new Declined();
            const result = declined.message("agree", "Please decline the {field} field");

            expect(result.message).toEqual("Please decline the agree field");
        });

        it("Should have a default error message", () => {
            const declined = new Declined();
            const error = declined.getError();

            expect(error).toBe("The {field} field must be declined");
        });

        it("Should return a normalized classname", () => {
            const declined = new Declined();
            const name = declined.getName();

            expect(name).toBe("declined");
        });
    });

});
