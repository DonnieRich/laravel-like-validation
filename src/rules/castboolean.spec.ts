import { describe, it, expect } from "vitest";
import CastBoolean from "./CastBoolean.js";

const mockRequestObject = {
    trueBool: true,
    falseBool: false,
    oneNumber: 1,
    zeroNumber: 0,
    stringOne: "1",
    stringZero: "0",
    stringTrue: "true",
    stringFalse: "false",
    twoNumber: 2,
    stringTwo: "2",
    nullValue: null,
    undefinedValue: undefined,
};

describe("CastBoolean", () => {

    describe("Valid values", () => {
        it("should validate boolean true and false", async () => {
            const rule = new CastBoolean();
            expect(await rule.validate(mockRequestObject, "trueBool")).toBe(true);
            expect(await rule.validate(mockRequestObject, "falseBool")).toBe(true);
        });

        it("should validate numeric 1 and 0", async () => {
            const rule = new CastBoolean();
            expect(await rule.validate(mockRequestObject, "oneNumber")).toBe(true);
            expect(await rule.validate(mockRequestObject, "zeroNumber")).toBe(true);
        });

        it("should validate string '1' and '0'", async () => {
            const rule = new CastBoolean();
            expect(await rule.validate(mockRequestObject, "stringOne")).toBe(true);
            expect(await rule.validate(mockRequestObject, "stringZero")).toBe(true);
        });
    });

    describe("Invalid values", () => {
        it("should invalidate non-boolean-castable values", async () => {
            const rule = new CastBoolean();
            expect(await rule.validate(mockRequestObject, "stringTrue")).toBe(false);
            expect(await rule.validate(mockRequestObject, "stringFalse")).toBe(false);
            expect(await rule.validate(mockRequestObject, "twoNumber")).toBe(false);
            expect(await rule.validate(mockRequestObject, "stringTwo")).toBe(false);
            expect(await rule.validate(mockRequestObject, "nullValue")).toBe(false);
            expect(await rule.validate(mockRequestObject, "undefinedValue")).toBe(false);
        });
    });

    describe("Generic", () => {
        it("Should return an object in case of fail", () => {
            const rule = new CastBoolean();
            const result = rule.message("agree", "");

            expect(result).toEqual({ name: "boolean", message: "The agree field must be able to be cast as a boolean" });
        });

        it("Should return a custom error message", () => {
            const rule = new CastBoolean();
            const result = rule.message("agree", "Please cast {field} as boolean");

            expect(result.message).toEqual("Please cast agree as boolean");
        });

        it("Should have a default error message", () => {
            const rule = new CastBoolean();
            const error = rule.getError();

            expect(error).toBe("The {field} field must be able to be cast as a boolean");
        });

        it("Should return a normalized classname", () => {
            const rule = new CastBoolean();
            const name = rule.getName();

            expect(name).toBe("boolean");
        });
    });

});
