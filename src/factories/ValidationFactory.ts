import BaseValidationFactory from "../base/BaseValidationFactory.js";
import type { IValidationSet } from "../contracts/IValidationSet.js";
import type { IValidator } from "../contracts/IValidator.js";
import ValidationError from "../errors/ValidationError.js";
import Validation from "../Validation.js";
import ValidationSet from "../ValidationSet.js";

class ValidationFactory extends BaseValidationFactory {

    protected validationSet!: IValidationSet;
    protected validationError!: typeof ValidationError;

    protected getValidationError(): typeof ValidationError {
        let validationError = this.validationError ?? ValidationError;
        return validationError;
    }

    protected getValidationSet(): IValidationSet {
        let validationSet = this.validationSet ?? new ValidationSet();
        return validationSet;
    }

    make(validator: IValidator, throwOnError: boolean = true): Function {

        const validationSet = this.getValidationSet();
        validator.applyValidationSet(validationSet);

        let validationError = this.getValidationError();

        const validation = new Validation(validator, throwOnError);
        validation.applyValidationError(validationError);

        return validation.init();
    }

    withValidationSet(validationSet: IValidationSet): ValidationFactory {
        this.validationSet = validationSet;
        return this;
    }

    withValidationError(validationError: typeof ValidationError): ValidationFactory {
        this.validationError = validationError;
        return this;
    }

}

export default ValidationFactory;