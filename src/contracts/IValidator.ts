import type Validation from "../Validation.js";
import type { IRuleObject } from "./IRuleObject.js";
import type { IValidationRequest } from "./IValidationRequest.js";
import type { IValidationSet } from "./IValidationSet.js";

export interface IValidator {

    rules(): IRuleObject;
    messages(): { [k: string]: string };
    attributes(): { [k: string]: string };
    applyValidationSet(validationSet: IValidationSet): void;
    validate(req: IValidationRequest, fail: (error: object, exit: boolean) => void): Promise<void>;
}