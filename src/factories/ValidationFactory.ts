import type BaseValidation from "../base/BaseValidation.js";
import BaseValidationFactory from "../base/BaseValidationFactory.js";
import type { IValidator } from "../contracts/IValidator.js";
import ValidationHandler from "../ValidationHandler.js";
import Validator from "../Validator.js";

class ValidationFactory extends BaseValidationFactory {

    private validator: IValidator;

    constructor() {
        super();
        this.validator = new Validator();
    }

    make(validation: BaseValidation): Function {

        this.validator.setValidation(validation);

        const validationSet = this.getValidationSet();
        this.validator.setValidationSet(validationSet);

        let validationError = this.getValidationError();

        const handler = new ValidationHandler(this.validator, this.throwOnError);
        handler.applyValidationError(validationError);

        return handler.init();
    }

}

export default ValidationFactory;