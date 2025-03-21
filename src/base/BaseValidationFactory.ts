import type { IValidator } from "../contracts/IValidator.js";
import ValidationError from "../errors/ValidationError.js";

abstract class BaseValidationFactory {
    // abstract make(validator: IValidator, validationError: typeof ValidationError): Function;
    abstract make(validator: IValidator, throwOnError: boolean): Function;
    // abstract make(validator: IValidator, throwOnError: boolean, validationError: typeof ValidationError): Function;
}

export default BaseValidationFactory;