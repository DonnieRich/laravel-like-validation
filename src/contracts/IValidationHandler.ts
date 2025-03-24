import type ValidationError from "../errors/ValidationError.js";

export interface IValidationHandler {
    init(): Function;
    applyValidationError(validationError: typeof ValidationError): void;
}