import { describe, expect, test, vi } from "vitest";
import Validation from '../../src/facades/Validation';
import ValidationError from "../../src/errors/ValidationError";
import { afterEach } from "node:test";
import ValidationFactory from "../../src/factories/ValidationFactory";

const validation = {
    body: {
        title: "5",
        content: 'required|min:10',
        tags: 'is_array'
    }
};

const malformedRulesInArray = {
    body: {
        title: 'required',
        content: ['gino']
    }
}

const malformedRulesInArrayWithCallback = {
    body: {
        title: 'required',
        content: [(data, key) => {
            // do something without returning a value
        }]
    }
}

const malformedRulesInArrayWithCallbackReturingWrongValue = {
    body: {
        title: 'required',
        content: [(data, key) => {
            // do something and return a wrong value
            return "gino"
        }]
    }
}


const emptyRulesArray = {
    body: {
        title: []
    }
}

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

describe("Errors", () => {

    test("should throw an error if the validation rule is malformed", async () => {
        const middleware = Validation.make(validation);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        "5": "Invalid rule 5 applied to title",
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

    test("should throw an error if the validation rule is malformed in an array", async () => {
        const middleware = Validation.make(malformedRulesInArray);
        const req = { body: data.valid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    content: {
                        gino: "Invalid rule gino applied to content",
                    }
                }
            }
        }));
    });

    test("should pass if the validation rules are an empty array", async () => {
        const middleware = Validation.make(emptyRulesArray);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(req).toHaveProperty('locals');
    });

    test("should throw an error if the callback validation rule doesn't return a value", async () => {
        const middleware = Validation.make(malformedRulesInArrayWithCallback);
        const req = { body: data.valid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    content: {
                        "invalid-callback": "The user provided callback didn\'t provided a valid return value. Array needed.",
                    }
                }
            }
        }));
    });

    test("should throw an error if the callback validation rule doesn't return a value", async () => {
        const middleware = Validation.make(malformedRulesInArrayWithCallbackReturingWrongValue);
        const req = { body: data.valid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    content: {
                        "invalid-callback": "The user provided callback didn\'t provided a valid return value. Array needed.",
                    }
                }
            }
        }));
    });
});