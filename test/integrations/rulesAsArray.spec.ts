import { describe, expect, test, vi } from "vitest";
import ValidationFacade from '../../src/facades/Validation';
import ValidationError from "../../src/errors/ValidationError";
import { afterEach } from "node:test";
import PresentIf from "../../src/rules/PresentIf";
import { IRuleObject } from "../../src/contracts/IRuleObject";


const validation: IRuleObject = {
    body: {
        title: 'required|max:255',
        content: ['required', 'min:10'],
        tags: 'present_if:terms,true'
    }
};

const validationWithArray: IRuleObject = {
    body: {
        title: 'required|max:255',
        content: ['required', 'min:10'],
        tags: ['present_if:terms,true'],
        checkTags: [new PresentIf().value(["tag1", "tag2"]).field("tags")],
    }
};


const data = {
    valid: {
        body: {
            title: "Hello World",
            content: "This is a test",
            tags: ["tag1", "tag2"],
            terms: true,
            checkTags: "present"
        }
    },
    invalid: {
        body: {
            title: "",
            content: "short",
            tags: ["tag1", "tag2", ""]
        }
    },
    invalidForTags: {
        body: {
            title: "",
            content: "short",
            tags: ["tag1", "tag2"],
            terms: true
        }
    },
    invalidForTagsAndTerms: {
        body: {
            title: "Hello World",
            content: "This is a test",
            terms: false
        }
    }
}

const utils = {
    next: (error) => error
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("Custom Rules", () => {

    test("should validate the data correctly", async () => {
        const middleware = ValidationFacade.make(validation);
        const req = { body: data.valid.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(req).toHaveProperty('locals');
        expect(req).toMatchObject({
            locals: {
                result: {
                    errors: {},
                    validated: {
                        body: {
                            title: "Hello World",
                            content: "This is a test",
                            tags: ["tag1", "tag2"]
                        }
                    }
                }
            }
        })
    });

    test("should validate if field is not present", async () => {
        const middleware = ValidationFacade.make(validation);
        const req = { body: data.invalidForTagsAndTerms.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(req).toHaveProperty('locals');
        expect(req).toMatchObject({
            locals: {
                result: {
                    errors: {},
                    validated: {
                        body: {
                            title: "Hello World",
                            content: "This is a test",
                        }
                    }
                }
            }
        })

        // expect(next).toHaveBeenCalledWith(new ValidationError({}));
        // expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        // expect(next).toHaveBeenCalledWith(expect.objectContaining({
        //     errors: {
        //         body: {
        //             tags: {
        //                 present_if: "The tags field must be present if the field terms has a value of true",
        //             }
        //         }
        //     }
        // }))

    });

    test("should return the error for malformed data", async () => {
        const middleware = ValidationFacade.make(validationWithArray);
        const req = { body: data.invalidForTags.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(new ValidationError({}));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        required: "The title field is required"
                    },
                    content: {
                        min: "The content must have a min length of 10"
                    },
                    checkTags: {
                        "present_if": "The checkTags field must be present if the field tags has a value of tag1,tag2"
                    }
                }
            }
        }))

    });

    test("should pass if the field is not present and the condition is not met", async () => {
        const middleware = ValidationFacade.make(validationWithArray);
        const req = { body: data.invalidForTagsAndTerms.body };
        const res = {};
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next)

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req).toMatchObject({
            locals: {
                result: {
                    errors: {},
                    validated: {
                        body: {
                            title: "Hello World",
                            content: "This is a test",
                        }
                    }

                }
            }
        })
    });

});