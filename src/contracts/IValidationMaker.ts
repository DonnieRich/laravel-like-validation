import type { IValidationSet as ValidationSet } from './IValidationSet'
import type { IValidation as Validation } from "./IValidation";

export interface IValidationMaker {
    make: (set: ValidationSet) => Validation;
}