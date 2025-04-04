import { type Request } from "express"
import type { IValidationSet } from "./IValidationSet.js";
import type BaseValidation from "../base/BaseValidation.js";

export interface IValidator {
    setValidation(validation: BaseValidation): void;
    setValidationSet(validationSet: IValidationSet): void;
    validate(req: Request, fail: (error: object, validated: object) => void): Promise<[object, object]>;
}