import type { IValidationSet } from "./IValidationSet.js";
import type BaseValidation from "../base/BaseValidation.js";
import type { Request } from "../types/Request.js";
export interface IValidator {
    setValidation(validation: BaseValidation): void;
    setValidationSet(validationSet: IValidationSet): void;
    validate(req: Request): Promise<[object, object]>;
}