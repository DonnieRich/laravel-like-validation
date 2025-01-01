import type { IValidationSet as ValidationSet } from './IValidationSet.js'
import type { IValidation as Validation } from "./IValidation.js";

export interface IValidationMaker {
    make: (set: ValidationSet) => Validation;
}