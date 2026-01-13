import { describe, expect, test, vi, afterEach } from "vitest";
import ValidationFactory from '../../src/factories/ValidationFactory';
import BaseValidation from "../../src/base/BaseValidation";

const utils = {
    next: (error) => error
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('BaseValidator targeted lines', () => {

    test('handlePromises should throw when Promise handler returns a non-array result', async () => {

        const validation = new class TestValidation extends BaseValidation {
            rules() {
                return {
                    body: {
                        title: [ (data, key) => {
                            return [true, {}];
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

        // Force Promise.allSettled to return a non-array value to hit the "Invalid promises array" branch
        vi.spyOn(Promise as any, 'allSettled').mockResolvedValue({} as any);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ errors: 'Invalid promises array' }));

    });

    test('validateQuery populates validated.query when query rules pass', async () => {

        const validation = new class TestValidation extends BaseValidation {
            rules() {
                return {
                    query: {
                        q: 'required'
                    }
                };
            }
        };

        const factory = new ValidationFactory();
        const middleware = factory.make(validation);

        const req: any = { params: {}, body: {}, query: { q: 'ok' } };
        const res = {} as any;
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(req).toHaveProperty('locals');
        expect(req.locals).toHaveProperty('result');
        expect(req.locals.result).toHaveProperty('validated');
        expect(req.locals.result.validated).toMatchObject({
            query: { q: 'ok' }
        });

    });

    test('stopOnFirstError branch sets method to all and completes without errors', async () => {

        const validation = new class TestValidation extends BaseValidation {
            rules() {
                return {
                    body: {}
                };
            }
        };

        // construct Validator directly so we can toggle the protected flag
        const ValidatorClass = (await import('../../src/Validator')).default;
        const ValidationHandlerClass = (await import('../../src/ValidationHandler')).default;
        const ValidationErrorClass = (await import('../../src/errors/ValidationError')).default;
        const ValidationSetClass = (await import('../../src/ValidationSet')).default;

        const validator: any = new ValidatorClass();
        validator.setValidation(validation);
        validator.setValidationSet(new ValidationSetClass());

        // force stopOnFirstError true to set method = 'all'
        validator.stopOnFirstError = true;

        const handler = new ValidationHandlerClass(validator, true);
        handler.applyValidationError(ValidationErrorClass);

        const middleware = handler.init();

        const req: any = { body: {} };
        const res = {} as any;
        const next = vi.spyOn(utils, 'next').mockImplementation(() => next);

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(req).toHaveProperty('locals');

    });

});
