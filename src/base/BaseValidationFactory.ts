import type { IValidator } from "../contracts/IValidator.js";
import ValidationError from "../errors/ValidationError.js";

abstract class BaseValidationFactory {
    abstract make(validator: IValidator, validationError: typeof ValidationError): Function;
}

export default BaseValidationFactory;