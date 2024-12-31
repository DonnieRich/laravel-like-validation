import type { IValidationError } from "../contracts/IValidationError"

class ValidationError extends Error implements IValidationError {
    status: number = 422;
    errors: object | undefined;

    constructor(errors: object) {
        super();
        this.errors = errors;
    }
}

export = ValidationError