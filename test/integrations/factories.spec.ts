import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import BaseValidation from '../../src/base/BaseValidation';
import ValidationFactory from '../../src/factories/ValidationFactory';
import ValidationError from "../../src/errors/ValidationError";
import { afterEach } from "node:test";

let validation;
const data = {
    valid: {
        body: {
            title: "Hello World",
            content: "This is a test"
        }
    },
    invalid: {
        body: {
            title: ""
        }
    }
}

const utils = {
    next: (error) => {
        return error;
    }
}

beforeAll(() => {
    validation = new class TestValidation extends BaseValidation {
        rules() {
            return {
                body: {
                    title: 'required|max:255',
                    content: 'required'
                }
            };
        }
    }
});

afterEach(() => {
    vi.restoreAllMocks();
});

afterAll(() => {
    validation = null;
});

describe("ValidationFactory", () => {
    test("should return an instance of ValidationFactory", () => {
        const factory = new ValidationFactory();
        expect(factory).toBeInstanceOf(ValidationFactory);
    });

    test("should return a function", () => {
        const factory = new ValidationFactory();
        const middleware = factory.make(validation);
        expect(middleware).toBeInstanceOf(Function);
    });

    test("should return a function that accepts 3 parameters", () => {
        const factory = new ValidationFactory();
        const middleware = factory.make(validation);
        expect(middleware.length).toBe(3);
    });

    test("should throw an error if the validation fails", async () => {
        const factory = new ValidationFactory();
        // console.log(validation.rules())
        const middleware = factory.make(validation);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new ValidationError({}));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.objectContaining({
                body: expect.objectContaining({
                    title: expect.objectContaining({
                        required: "The title field is required",
                    }),
                    content: expect.objectContaining({
                        required: "The content field is required",
                    })
                })
            })
        }));
    });

})