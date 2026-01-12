import { describe, expect, test, vi, afterEach } from "vitest";
import ValidationFactory from '../../src/factories/ValidationFactory';
import ValidationError from "../../src/errors/ValidationError";
import BaseRule from '../../src/base/BaseRule';
import BaseValidation from "../../src/base/BaseValidation";

const utils = {
    next: (error) => error
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('BaseValidator extra branches', () => {

    test('function rule that returns invalid callback result should produce invalid-callback error', async () => {

        const validation = new class TestValidation extends BaseValidation {
            rules() {
                return {
                    body: {
                        title: [ (data, key) => {
                            // invalid return (not an array)
                            return true;
                        }]
                    }
                };
            }
        };

        const factory = new ValidationFactory();
        const middleware = factory.make(validation);

        const req: any = { body: { title: 'value' } };
        const res = {} as any;
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        'invalid-callback': "The user provided callback didn't provided a valid return value. Array needed."
                    }
                }
            }
        }));

    });

    test('BaseRule instance should call its message and support optional flag', async () => {

        class MyOptionalRule extends BaseRule {
            protected optional = true;

            validate() {
                return false; // fail to trigger message
            }

            message(field: string, message: string) {
                return { name: 'my_rule', message: 'my custom message' };
            }
        }

        const validation = new class TestValidation extends BaseValidation {
            rules() {
                return {
                    body: {
                        title: [ new MyOptionalRule() ]
                    }
                };
            }
        };

        const factory = new ValidationFactory();
        const middleware = factory.make(validation);

        const req: any = { body: { title: '' } };
        const res = {} as any;
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                body: {
                    title: {
                        my_rule: 'my custom message'
                    }
                }
            }
        }));

    });

    test('should include params and query in errors when those sections have failures', async () => {
        
        const validation = new class TestValidation extends BaseValidation {
            rules() {
                return {
                    params: {
                        id: 'numeric'
                    },
                    query: {
                        q: 'required'
                    }
                };
            }
        };

        const factory = new ValidationFactory();
        const middleware = factory.make(validation);

        const req: any = { params: { id: 'abc' }, query: { q: '' }, body: {} };
        const res = {} as any;
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 422 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            errors: {
                params: {
                    id: {
                        numeric: 'The id field must be a number'
                    }
                },
                query: {
                    q: {
                        required: 'The q field is required'
                    }
                }
            }
        }));

    });

    test('should include params and query in validated when they pass', async () => {

        const validation = new class TestValidation extends BaseValidation {
            rules() {
                return {
                    params: {
                        id: 'numeric'
                    },
                    query: {
                        q: 'required'
                    }
                };
            }
        };

        const factory = new ValidationFactory();
        const middleware = factory.make(validation);

        const req: any = { params: { id: '123' }, query: { q: 'ok' }, body: {} };
        const res = {} as any;
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(req).toHaveProperty('locals');
        expect(req.locals).toHaveProperty('result');
        expect(req.locals.result).toHaveProperty('validated');
        expect(req.locals.result.validated).toMatchObject({
            params: { id: '123' },
            query: { q: 'ok' }
        });

    });

    test('non-string/non-function/non-BaseRule rule should trigger server error (foundInvalidRule branch)', async () => {

        const validation = new class TestValidation extends BaseValidation {
            rules() {
                return {
                    body: {
                        // put the invalid value inside an array so getRule is called
                        title: [123]
                    }
                };
            }
        };

        const factory = new ValidationFactory();
        const middleware = factory.make(validation);

        const req: any = { body: { title: 'value' } };
        const res = {} as any;
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ errors: '' }));

    });

});
