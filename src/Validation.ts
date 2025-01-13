/// <reference types="express" />
import type { IValidation } from "./contracts/IValidation.js";
import ValidationError from "./errors/ValidationError.js";
import type { IValidationRequest } from "./contracts/IValidationRequest.js"
import type { IValidator } from "./contracts/IValidator.js";
import type { Request, Response } from "express";

class Validation implements IValidation {

    private validator: IValidator;
    private validationError!: typeof ValidationError;

    constructor(validator: IValidator) {
        this.validator = validator;
    }

    applyValidationError(validationError: typeof ValidationError): void {
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

    private async validationMiddleware(req: IValidationRequest, res: Response, next: Function): Promise<void> {

        let result: { status: number, errors: object } = {
            status: 422,
            errors: {}
        };

        try {

            await this.validator.validate(req, (error: { status?: number }, exit = false) => {

                result.status = error.status ?? 422;

                if (exit) {
                    throw new this.validationError(error);
                } else {
                    result.errors = this.mergeErrors(error, result.errors)
                }

            })

            if (Object.keys(result.errors).length > 0) {
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

    init(): Function {

        return this.validationMiddleware.bind(this)

        // return async (req: IValidationRequest, res: Response, next: Function) => {

        //     let result: { status: number, errors: object } = {
        //         status: 422,
        //         errors: {}
        //     };

        //     try {

        //         await this.validator.validate(req, (error: { status?: number }, exit = false) => {

        //             result.status = error.status ?? 422;

        //             if (exit) {
        //                 throw new this.validationError(error);
        //             } else {
        //                 result.errors = this.mergeErrors(error, result.errors)
        //             }

        //         })

        //         if (Object.keys(result.errors).length > 0) {
        //             throw new this.validationError(result.errors);
        //         }

        //         next();

        //     } catch (error: Error | ValidationError | any) {
        //         if (error.prototype instanceof ValidationError || error instanceof ValidationError) {
        //             next(error)
        //         } else {
        //             next({ status: 500, errors: error.message })
        //         }
        //     }
        // }
    }
}

export default Validation