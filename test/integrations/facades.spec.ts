import { describe, expect, test, vi } from "vitest";
import ValidationFacade from '../../src/facades/ValidationFacade';
import ValidationError from "../../src/errors/ValidationError";
import { afterEach } from "node:test";

const validation = {
    body: {
        title: 'required|max:255',
        content: 'required|min:10',
        tags: 'is_array'
    }
};

const data = {
    valid: {
        body: {
            title: "Hello World",
            content: "This is a test",
            tags: ["tag1", "tag2"]
        }
    },
    invalid: {
        body: {
            title: "",
            content: "Short",
            tags: "not an array"
        }
    }
}

const utils = {
    next: (error) => error
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("ValidationFacade", () => {

    test("should return a validator middleware", () => {
        const middleware = ValidationFacade.make(validation);

        expect(middleware).toBeInstanceOf(Function);

    });

    test("should return a function that accepts 3 parameters", () => {
        const middleware = ValidationFacade.make(validation);
        expect(middleware.length).toBe(3);
    });

    test("should throw an error if the validation fails", async () => {
        const middleware = ValidationFacade.make(validation);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new ValidationError({}));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        required: "The title field is required",
                    },
                    content: {
                        min: "The content must have a min length of 10",
                    },
                    tags: {
                        is_array: "The tags field must be an array",
                    }
                }
            }
        }));
    });

    test("should apply custom error messages", async () => {
        const customMessages = {
            "title.required": "Custom required title error message",
            "content.min": "Custom min content error message"
        };
        const middleware = ValidationFacade.make(validation, customMessages);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new ValidationError({}));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        required: "Custom required title error message",
                    },
                    content: {
                        min: "Custom min content error message",
                    },
                    tags: {
                        is_array: "The tags field must be an array",
                    }
                }
            }
        }));
    });

    test("should apply custom error attributes", async () => {
        const customMessages = {
            "title.required": "Custom required main title error message",
            "content.min": "Custom min post content error message"
        };

        const customAttributes = {
            title: "main title",
            content: "post content"
        };

        const middleware = ValidationFacade.make(validation, customMessages, customAttributes);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new ValidationError({}));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        required: "Custom required main title error message",
                    },
                    content: {
                        min: "Custom min post content error message",
                    },
                    tags: {
                        is_array: "The tags field must be an array",
                    }
                }
            }
        }));
    });

    test("should apply dynamic values in the error message", async () => {
        const customMessages = {
            "content.min": "Post content is too short. Minimum length is {value} characters."
        };

        const customAttributes = {
            content: "Post content"
        };

        const middleware = ValidationFacade.make(validation, customMessages, customAttributes);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new ValidationError({}));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        required: "The title field is required",
                    },
                    content: {
                        min: "Post content is too short. Minimum length is 10 characters.",
                    },
                    tags: {
                        is_array: "The tags field must be an array",
                    }
                }
            }
        }));
    });

});