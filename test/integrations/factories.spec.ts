import { describe, expect, test, vi } from "vitest";
import BaseValidation from '../../src/base/BaseValidation';
import ValidationFactory from '../../src/factories/ValidationFactory';
import ValidationError from "../../src/errors/ValidationError";
import { afterEach } from "node:test";
import ValidationSet from "../../src/ValidationSet";
import BaseRule from "../../src/base/BaseRule";

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

const customValidation = new class TestValidation extends BaseValidation {
    rules() {
        return {
            body: {
                title: 'custom_rule',
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
            errors: {
                body: {
                    title: {
                        required: "The title field is required",
                    },
                    content: {
                        required: "The content field is required",
                    }
                }
            }
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

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        invalidRule: "Invalid rule invalidRule applied to title",
                    }
                }
            }
        }));
    });

    test("should apply custom validationSet", async () => {

        const customRule = new class CustomRule extends BaseRule {

            protected error = 'The {field} field is invalid';

            async validate() {
                return false;
            }

            message(field: string, message: string) {
                return {
                    name: this.getName(),
                    message: this.generateMessage({ field }, message)
                }
            }
        }

        const customValidationSet = new ValidationSet();
        customValidationSet.add(customRule);
        const middleware = new ValidationFactory().withValidationSet(customValidationSet).make(customValidation);

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
                        custom_rule: "The title field is invalid",
                    },
                }
            }
        }));
    });

    test("should apply custom validationSet and show default validation error for custom rule", async () => {

        const customRule = new class CustomRule extends BaseRule {

            async validate() {
                return false;
            }

            message(field: string, message: string) {
                return {
                    name: this.getName(),
                    message: this.generateMessage({ field }, message)
                }
            }
        }

        const customValidationSet = new ValidationSet();
        customValidationSet.add(customRule);
        const middleware = new ValidationFactory().withValidationSet(customValidationSet).make(customValidation);

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
                        custom_rule: "Missing default error message for custom_rule applied on title",
                    },
                }
            }
        }));
    });

    test("should apply multiple validation rules as array in validationSet", async () => {

        const customRule = new class CustomRule extends BaseRule {

            protected error = 'The {field} field is invalid';

            async validate() {
                return true;
            }

            message(field: string, message: string) {
                return {
                    name: this.getName(),
                    message: this.generateMessage({ field }, message)
                }
            }
        }

        const customRuleFail = new class CustomRuleFail extends BaseRule {

            protected error = 'The {field} field must be different';

            async validate() {
                return true;
            }

            message(field: string, message: string) {
                return {
                    name: this.getName(),
                    message: this.generateMessage({ field }, message)
                }
            }
        }

        const customValidationSet = new ValidationSet();
        customValidationSet.add([customRule, customRuleFail]);
        const middleware = new ValidationFactory().withValidationSet(customValidationSet).make(customValidation);

        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalledWith(new ValidationError({}));
    });

    test("should use a custom error if the validation fails", async () => {

        const customValidationError = class CustomValidationError extends ValidationError {
            constructor(errors: object) {
                super(errors);
                this.status = 400;
            }
        }


        const factory = new ValidationFactory();
        const middleware = factory.withValidationError(customValidationError).make(validation);
        const req = { body: data.invalid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new ValidationError({}));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
    });
})