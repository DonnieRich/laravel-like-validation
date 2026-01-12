import type { IValidationHandler } from "./contracts/IValidationHandler.js";
import ValidationError from "./errors/ValidationError.js";
import type { IValidator } from "./contracts/IValidator.js";
import { type Request } from "./types/Request.js";
class ValidationHandler implements IValidationHandler {

    private validator: IValidator;
    private validationError!: typeof ValidationError;
    private throwOnError: boolean;

    constructor(validator: IValidator, throwOnError: boolean) {
        this.validator = validator;
        this.throwOnError = throwOnError;
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

    private mergeValidated(validated: object, start: object): object {
        const merged: { [key: string]: object } = { ...start }

        for (const key in validated) {
            merged[key] = validated[key as keyof typeof validated]
        }
        return merged
    }

    private async validationMiddleware(req: Request, res: Response, next: Function): Promise<void> {

        try {

            let result: { status: number, errors: object, validated: object } = {
                status: 422,
                errors: {},
                validated: {}
            };

            const [errors, validated] = await this.validator.validate(req);

            result.errors = this.mergeErrors(errors, result.errors);
            result.validated = this.mergeValidated(validated, result.validated)

            // always attach result to the request so downstream handlers
            // (including error handlers) can access validation details
            req.locals = { result };

            if (Object.keys(result.errors).length > 0 && this.throwOnError) {
                throw new this.validationError(result.errors);
            }

            next();

        } catch (error: any) {
            if (error.prototype instanceof ValidationError || error instanceof ValidationError) {
                next(error)
            } else {
                next({ status: 500, errors: error.message })
            }
        }
    }

    init(): Function {

        return this.validationMiddleware.bind(this)

    }
}

export default ValidationHandler;