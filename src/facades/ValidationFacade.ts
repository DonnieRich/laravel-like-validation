import type { IRuleObject } from "../contracts/IRuleObject.js";
import BaseValidation from "../base/BaseValidation.js";
import ValidationFactory from "../factories/ValidationFactory.js";

class ValidationFacade {

    static createValidator(rules: IRuleObject, messages: { [key: string]: string } = {}, attributes: { [key: string]: string } = {}) {
        const validation = new class extends BaseValidation {
            rules() {
                return rules;
            }

            messages() {
                return messages;
            }

            attributes() {
                return attributes;
            }
        }

        return (new ValidationFactory()).make(validation);
    }
}

export default ValidationFacade;