import type BaseValidation from "./base/BaseValidation.js";
import type { IValidationSet } from "./contracts/IValidationSet.js";
import BaseValidator from "./base/BaseValidator.js";
import type { Request } from "express";

class Validator extends BaseValidator {
    public setValidation(validation: BaseValidation): void {
        this.validation = validation;
    }

    public setValidationSet(validationSet: IValidationSet): void {
        this.validationSet = validationSet;
    }

    public async validate(req: Request): Promise<[object, object]> {

        this.beforeValidate();

        await this.validateBody(req.body);
        await this.validateParams(req.params);
        await this.validateQuery(req.query);

        this.afterValidate();

        return [
            this.getValidationErrors(),
            this.getValidatedData()
        ]

    }
}

export default Validator;