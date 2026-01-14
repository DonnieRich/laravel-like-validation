import { describe, expect, it } from "vitest";
import Prohibited from "./Prohibited.js";

describe("Prohibited", () => {

    it("Should pass when field is missing", async () => {
        const rule = new Prohibited();

        const result = await rule.validate({}, "field");

        expect(result).toBe(true);
    });

    it("Should pass when field is null", async () => {
        const rule = new Prohibited();

        const result = await rule.validate({ field: null }, "field");

        expect(result).toBe(true);
    });

    it("Should pass when field is empty string", async () => {
        const rule = new Prohibited();

        const result = await rule.validate({ field: "" }, "field");

        expect(result).toBe(true);
    });

    it("Should pass when field is empty array", async () => {
        const rule = new Prohibited();

        const result = await rule.validate({ field: [] }, "field");

        expect(result).toBe(true);
    });

    it("Should fail when field is non-empty string", async () => {
        const rule = new Prohibited();

        const result = await rule.validate({ field: "value" }, "field");

        expect(result).toBe(false);
    });

    it("Should fail when field is a non-array, non-string non-null value", async () => {
        const rule = new Prohibited();

        const result = await rule.validate({ field: {} }, "field");

        expect(result).toBe(false);
    });

    describe("Generic", () => {

        it("Should return an object in case of fail", () => {
            const rule = new Prohibited();

            const result = rule.message("field");

            expect(result).toEqual({ name: "prohibited", message: "The field field must be missing or empty" });
        });

        it("Should return a custom error message", () => {
            const rule = new Prohibited();

            const result = rule.message("title", "{field} must not be provided");

            expect(result.message).toBe("title must not be provided");
        });

        it("Should have a default error message", () => {
            const rule = new Prohibited();

            const error = rule.getError();

            expect(error).toBe("The {field} field must be missing or empty");
        });

        it("Should return a normalized classname", () => {
            const rule = new Prohibited();

            const name = rule.getName();

            expect(name).toBe("prohibited");
        });

    });

});
