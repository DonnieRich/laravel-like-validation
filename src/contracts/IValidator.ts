import type { IRuleObject } from "./IRuleObject.js";
import type { IValidationRequest } from "./IValidationRequest.js";

export interface IValidator {

    getRules: () => IRuleObject;
    getMessages: () => { [k: string]: string };
    getAttributes: () => { [k: string]: string };
    validate: (req: IValidationRequest, fail: (error: object, exit: boolean) => void) => void;
}