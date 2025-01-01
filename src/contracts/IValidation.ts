import type { IValidationError } from "./IValidationError.js";
import type { IValidator } from "./IValidator.js";

export interface IValidation {
    init: (validator: IValidator, validationError: IValidationError) => Function;
}