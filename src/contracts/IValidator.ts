export interface IValidator {
    errors: object;
    rules: object;
    messages: object;
    attributes: object;
    fail: (error: object, exit: boolean) => void;

    beforeValidate: () => void;
    afterValidate: () => void;
    addError: (key: string, error: { name: string, message: string }) => void;
    getRule: (rule: string, key: string) => object;
    applyValidation: (req: object) => void;
    validateBody: (req: object) => void;
    validateParams: (req: object) => void;
    validateQuery: (req: object) => void;
    validate: (req: object, fail: (error: object, exit: boolean) => void) => void;
}