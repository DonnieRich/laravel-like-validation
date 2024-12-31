import type { IValidation } from "./contracts/IValidation";
// import type { IValidator as Validator } from "./contracts/IValidator";
// import type { IValidationError } from "./contracts/IValidationError";
import ValidationError = require("./errors/ValidationError");
import type Validator = require("./Validator");
import type { IValidationRequest as ValidationRequest } from "./contracts/IValidationRequest"

// import ValidationSet = require("./ValidationSet");


class Validation implements IValidation {

    private validator: Validator;
    private validationError: typeof ValidationError;

    constructor(validator: Validator, validationError: typeof ValidationError = ValidationError) {
        this.validator = validator;
        this.validationError = validationError;
    }

    private mergeErrors(error: object, start: object): object {
        const merged: { [key: string]: object } = { ...start }

        for (const key in error) {
            if (typeof error[key as keyof typeof error] === 'object') {
                merged[key] = { ...this.mergeErrors(error[key as keyof typeof error], merged[key]) }
            } else {
                merged[key] = error[key as keyof typeof error]
            }

        }
        return merged
    }

    init() {

        return (req: ValidationRequest, res: Response, next: Function) => {

            let result: { status: number, errors: object } = {
                status: 422,
                errors: {}
            };

            try {

                this.validator.validate(req, (error: { status?: number }, exit = false) => {

                    result.status = error.status ?? 422;

                    if (exit) {
                        // this.validationError.setErrors(error);
                        throw new this.validationError(error);
                    } else {
                        result.errors = this.mergeErrors(error, result.errors)
                    }

                });

                if (Object.keys(result.errors).length > 0) {
                    // this.validationError.setErrors(result.errors);
                    throw new this.validationError(result.errors);
                }

                next();

            } catch (error: Error | ValidationError | any) {
                if (error.prototype instanceof ValidationError || error instanceof ValidationError) {
                    next(error)
                } else {
                    next({ status: 500, errors: error.message })
                }

            }


        }

    }
}

export = { Validation }