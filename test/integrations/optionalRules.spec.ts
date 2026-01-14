import { describe, expect, test, vi, afterEach } from "vitest";
import ValidationFacade from '../../src/facades/Validation';
import ValidationError from "../../src/errors/ValidationError";

const utils = {
    next: (error) => error
}

afterEach(() => {
    vi.restoreAllMocks();
})

describe("Optional rules", () => {

    describe("Nullable", () => {
        test("If field is null do not apply other validations", async () => {
            const validation = {
                body: {
                    title: 'required|min:1',
                    content: 'nullable|min:10'
                }
            }
            const middleware = ValidationFacade.make(validation);
            const req = { body: { title: "Hello World!", content: null } };
            const res = {};
            const next = vi.spyOn(utils, 'next').mockImplementation(() => {})

            await middleware(req, res, next);

            expect(next).toHaveBeenCalledOnce();
            expect(req).toHaveProperty('locals');
            expect(req).toMatchObject({
                locals: {
                    result: {
                        errors: {},
                        validated: {
                            body: {
                                title: "Hello World!",
                                content: null
                            }
                        }
                    }
                }
            })
        });

        test("If field is not null apply other validations", async () => {
            const validation = {
                body: {
                    title: 'required|min:1',
                    content: 'nullable|min:10'
                }
            }
            const middleware = ValidationFacade.make(validation);
            const req = { body: { title: "test", content: "short"}};
            const res = {};
            const next = vi.spyOn(utils, 'next').mockImplementation(() => {})

            await middleware(req, res, next);

            expect(next).toHaveBeenCalledOnce();
            expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                errors: {
                    body: {
                        content: {
                            min: "The content must have a min length of 10"
                        }
                    }
                }
            }));
        })
    })

    describe("Prohibited", () => {
        test("Should throw an error if prohibited field is present", async () => {
            const validation = {
                body: {
                    title: 'required',
                    secret: 'prohibited'
                }
            }
            const middleware = ValidationFacade.make(validation);
            const req = { body: { title: "Hello", secret: "value" } };
            const res = {};
            const next = vi.fn();

            await middleware(req, res, next);

            expect(next).toHaveBeenCalledOnce();
            expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                errors: {
                    body: {
                        secret: {
                            prohibited: "The secret field must be missing or empty"
                        }
                    }
                }
            }));
        })

        test("Should pass when prohibited field is not present", async () => {
            const validation = {
                body: {
                    title: 'required',
                    secret: 'prohibited'
                }
            }

            const middleware = ValidationFacade.make(validation);
            const req = { body: { title: "Hello" } };
            const res = {};
            const next = vi.spyOn(utils, 'next').mockImplementation(() => {})

            await middleware(req, res, next);

            expect(next).toHaveBeenCalledOnce();
            expect(req).toHaveProperty('locals');
            expect(req).toMatchObject({
                locals: {
                    result: {
                        errors: {},
                        validated: {
                            body: {
                                title: "Hello"
                            }
                        }
                    }
                }
            })
        })
    })

    describe("ProhibitedIf", () => {
        test("Should throw an error if field is present when condition is met", async () => {
            const validation = {
                body: {
                    title: 'required',
                    secret: 'prohibited_if:confirm,true',
                    confirm: 'boolean'
                }
            }

            const middleware = ValidationFacade.make(validation);
            const req = { body: { title: "Hello", confirm: true, secret: "value" } };
            const res = {};
            const next = vi.spyOn(utils, 'next').mockImplementation(() => {})

            await middleware(req, res, next);

            expect(next).toHaveBeenCalledOnce();
            expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                errors: {
                    body: {
                        secret: {
                            prohibited_if: "The secret field must be missing or empty if the field confirm has a value of true"
                        }
                    }
                }
            }));
        })

        test("Should pass if field is present when condition is not met", async () => {
            const validation = {
                body: {
                    title: 'required',
                    secret: 'prohibited_if:confirm,true',
                    confirm: 'boolean'
                }
            }

            const middleware = ValidationFacade.make(validation);
            const req = { body: { title: "Hello", confirm: 0, secret: "value" } };
            const res = {};
            const next = vi.spyOn(utils, 'next').mockImplementation(() => {})

            await middleware(req, res, next);

            expect(next).not.toHaveBeenCalledWith(new ValidationError({}));
            expect(req).toHaveProperty('locals');
            expect(req).toMatchObject({
                locals: {
                    result: {
                        errors: {},
                        validated: {
                            body: {
                                title: "Hello",
                                confirm: 0,
                                secret: "value"
                            }
                        }
                    }
                }
            })
        });

        test("Should throw an error if field fails on other rules when is present but condition is not met", async () => {
            const validation = {
                body: {
                    title: 'required',
                    secret: 'prohibited_if:confirm,true|min:10',
                    confirm: 'boolean'
                }
            }

            const middleware = ValidationFacade.make(validation);
            const req = { body: { title: "Hello", confirm: false, secret: "value" } };
            const res = {};
            const next = vi.spyOn(utils, 'next').mockImplementation(() => {})

            await middleware(req, res, next);

            expect(next).toHaveBeenCalledOnce();
            expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                errors: {
                    body: {
                        secret: {
                            min: "The secret must have a min length of 10"
                        }
                    }
                }
            }));
        })
    })
})