import { describe, expect, test, vi } from "vitest";
import { afterEach } from "node:test";
import ValidationFacade from '../../src/facades/Validation';

const validation = {
    body: {
        title: 'required|min:1',
        content: 'required|min:10'
    }
}

const data = {
    valid: {
        body: {
            title: "Hello World!",
            contents: null
        }
    }
}

const utils = {
    next: (error) => error
}

afterEach(() => {
    vi.restoreAllMocks();
})

describe("Optional rules", () => {

    describe("Nullable", () => {
        test.skip("If field is null do not apply other validations", async () => {
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
                                content: null
                            }
                        }
                    }
                }
            })
        })
    })
})