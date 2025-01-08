import BaseValidationFactory from "../base/BaseValidationFactory.js";
import type { IValidator } from "../contracts/IValidator.js";
import ValidationError from "../errors/ValidationError.js";
import Validation from "../Validation.js";

class ValidationFactory extends BaseValidationFactory {

    make(validator: IValidator, validationError: typeof ValidationError): Function {
        return new Validation(validator, validationError).init();
    }

}

export default ValidationFactory;