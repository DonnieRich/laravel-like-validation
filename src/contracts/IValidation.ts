import type ValidationError from "../errors/ValidationError.js";

export interface IValidation {
    init(): Function;
    applyValidationError(validationError: typeof ValidationError): void;
}