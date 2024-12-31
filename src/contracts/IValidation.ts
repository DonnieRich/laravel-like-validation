import type { IValidationError } from "./IValidationError";
import type { IValidator } from "./IValidator";

export interface IValidation {
    init: (validator: IValidator, validationError: IValidationError) => Function;
}