import type { IValidationSet } from "../contracts/IValidationSet.js";
import ValidationError from "../errors/ValidationError.js";
import ValidationSet from "../ValidationSet.js";
import type BaseValidation from "./BaseValidation.js";

abstract class BaseValidationFactory {
    protected validationSet!: IValidationSet;
    protected validationError!: typeof ValidationError;
    protected throwOnError: boolean = true;

    protected getValidationError(): typeof ValidationError {
        let validationError = this.validationError ?? ValidationError;
        return validationError;
    }

    protected getValidationSet(): IValidationSet {
        let validationSet = this.validationSet ?? new ValidationSet();
        return validationSet;
    }

    doNotThrow(): BaseValidationFactory {
        this.throwOnError = false;
        return this;
    }

    withValidationSet(validationSet: IValidationSet): BaseValidationFactory {
        this.validationSet = validationSet;
        return this;
    }

    withValidationError(validationError: typeof ValidationError): BaseValidationFactory {
        this.validationError = validationError;
        return this;
    }

    abstract make(validation: BaseValidation, throwOnError: boolean): Function;
}

export default BaseValidationFactory;