import { type Request } from "express"
import type { IRuleObject } from "./IRuleObject.js";
import type { IValidationSet } from "./IValidationSet.js";

export interface IValidator {

    rules(): IRuleObject;
    messages(): { [k: string]: string };
    attributes(): { [k: string]: string };
    applyValidationSet(validationSet: IValidationSet): void;
    validate(req: Request, fail: (error: object, validated: object) => void): Promise<void>;
}