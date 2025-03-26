import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import BaseValidation from '../../src/base/BaseValidation';
import ValidationFactory from '../../src/factories/ValidationFactory';
import ValidationError from "../../src/errors/ValidationError";
import { afterEach } from "node:test";

const validation = new class TestValidation extends BaseValidation {
    rules() {
        return {
            body: {
                title: 'required|max:255',
                content: 'required'
            }
        };
    }
};

const malformedValidation = new class TestValidation extends BaseValidation {
    rules() {
        return {
            body: {
                title: 'invalidRule',
                content: 'required'
            }
        };
    }
}

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
    next: (error) => error
}

afterEach(() => {
    vi.restoreAllMocks();
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

    test("should pass the error inside req.locals if throwOnError is false", async () => {
        const factory = new ValidationFactory();
        const middleware = factory.doNotThrow().make(validation);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req).toHaveProperty('locals');
        expect(req).toMatchObject({
            locals: {
                result: {
                    status: 422,
                    errors: {
                        body: {
                            title: {
                                required: "The title field is required"
                            },
                            content: {
                                required: "The content field is required"
                            }
                        }
                    },
                    validated: {}
                }
            }
        })
    });

    test("should not throw an error if the validation passes", async () => {
        const factory = new ValidationFactory();
        const middleware = factory.make(validation);
        const req = { body: data.valid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).not.toHaveBeenCalledWith(new ValidationError({}));
    });

    test("should pass the validated values inside req.locals if the validation passes", async () => {
        const factory = new ValidationFactory();
        const middleware = factory.make(validation);
        const req = { body: data.valid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).not.toHaveBeenCalledWith(new ValidationError({}));
        expect(req).toHaveProperty('locals');
        expect(req).toMatchObject({
            locals: {
                result: {
                    errors: {},
                    validated: {
                        body: {
                            title: "Hello World",
                            content: "This is a test"
                        }
                    }

                }
            }
        })
    });

    test("should throw an error if validation rules are malformed", async () => {
        const factory = new ValidationFactory();
        const middleware = factory.make(malformedValidation);
        const req = { body: data.valid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith({ status: 500, errors: "Invalid rule invalidRule applied to title" });

    });

})