import type BaseValidation from "./base/BaseValidation.js";
import type { IValidationRequest } from "./contracts/IValidationRequest.js";
import type { IValidationSet } from "./contracts/IValidationSet.js";
import BaseValidator from "./base/BaseValidator.js";

class Validator extends BaseValidator {
    public setValidation(validation: BaseValidation): void {
        this.validation = validation;
    }

    public setValidationSet(validationSet: IValidationSet): void {
        this.validationSet = validationSet;
    }

    public async validate(req: IValidationRequest): Promise<[object, object]> { //Promise<void> {
        // this.fail = fail;

        this.beforeValidate();

        await this.validateBody(req.body);
        await this.validateParams(req.params);
        await this.validateQuery(req.query);

        this.afterValidate();

        return [
            this.getValidationErrors(),
            this.getValidatedData()
        ]

        // this.fail(this.getValidationErrors(), this.getValidatedData());
    }
}

export default Validator;