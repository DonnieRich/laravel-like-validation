import { describe, expect, it } from "vitest";
import ProhibitedIf from "./ProhibitedIf.js";

const mockRequestObject = {
    checkField: "yes",
    checkNumber: 10,
    field: "value",
    emptyString: "",
    emptyArray: [],
    nullField: null,
};

describe("ProhibitedIf", () => {

    it("Should pass when condition is not met", async () => {
        const rule = new ProhibitedIf();

        const result = await rule.validate(mockRequestObject, "field", "checkField,no");

        expect(result).toBe(true);
    });

    it("Should pass when condition is met and field is missing", async () => {
        const rule = new ProhibitedIf();

        const result = await rule.validate({ checkField: "yes" }, "missingField", "checkField,yes");

        expect(result).toBe(true);
    });

    it("Should pass when condition is met and field is null", async () => {
        const rule = new ProhibitedIf();

        const result = await rule.validate(mockRequestObject, "nullField", "checkField,yes");

        expect(result).toBe(true);
    });

    it("Should pass when condition is met and field is empty string or array", async () => {
        const rule = new ProhibitedIf();

        const r1 = await rule.validate(mockRequestObject, "emptyString", "checkField,yes");
        const r2 = await rule.validate(mockRequestObject, "emptyArray", "checkField,yes");

        expect(r1).toBe(true);
        expect(r2).toBe(true);
    });

    it("Should fail when condition is met and field is present and non-empty", async () => {
        const rule = new ProhibitedIf();

        const result = await rule.validate(mockRequestObject, "field", "checkField,yes");

        expect(result).toBe(false);
    });

    it("Should handle numeric conditions correctly", async () => {
        const rule = new ProhibitedIf();

        const result = await rule.validate(mockRequestObject, "field", "checkNumber,10");

        expect(result).toBe(false);
    });

    it("Should work with fluent API when condition set via field/value and pass when missing", async () => {
        const rule = new ProhibitedIf();

        rule.field("checkNumber").value(10);

        const result = await rule.validate(mockRequestObject, "missingField");

        expect(result).toBe(true);
    });

    describe("Generic", () => {

        it("Should return an object in case of fail", () => {
            const rule = new ProhibitedIf();

            const result = rule.message("field", "", "otherField,value");

            expect(result).toEqual({ name: "prohibited_if", message: "The field field must be missing or empty if the field otherField has a value of value" });
        });

        it("Should return a custom error message", () => {
            const rule = new ProhibitedIf();

            const result = rule.message("title", "{field} must be absent when {fieldToCheck} is {valueToCheck}", "checkField,yes");

            expect(result.message).toBe("title must be absent when checkField is yes");
        });

        it("Should have a default error message", () => {
            const rule = new ProhibitedIf();

            const error = rule.getError();

            expect(error).toBe("The {field} field must be missing or empty if the field {fieldToCheck} has a value of {valueToCheck}");
        });

        it("Should return a normalized classname", () => {
            const rule = new ProhibitedIf();

            const name = rule.getName();

            expect(name).toBe("prohibited_if");
        });

    });

});
