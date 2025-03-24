import type { IRuleObject } from "../contracts/IRuleObject.js";

abstract class BaseValidation {
    abstract rules(): IRuleObject;

    messages(): { [key: string]: string } {
        return {};
    }

    attributes(): { [key: string]: string } {
        return {};
    }
}

export default BaseValidation;