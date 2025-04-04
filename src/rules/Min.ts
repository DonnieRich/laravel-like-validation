import BaseRule from "../base/BaseRule.js";

class Min extends BaseRule {
    protected error = "The {field} must have a min length of {value}"

    async validate(data: { [s: string]: any }, field: string, value: string): Promise<boolean> {

        const isArray = Array.isArray(data[field]);
        const isString = typeof data[field] === "string";
        const isNumber = !isNaN(data[field]);

        const validationValue = Number(value);

        const isValidationValueInvalid = isNaN(validationValue);

        if (isValidationValueInvalid) {
            this.error = "The value expected for the validation must be a number. The value provided is: {value}";
            return false;
        }

        if (isArray || isString) {
            const length = data[field].length;
            return length >= validationValue
        } else if (isNumber) {
            const length = data[field];
            return length >= validationValue
        } else {

            this.error = "The field under validation ({field}) must be of type: Array, String or Number";

        }

        return false;
    }

    message(field: string, message: string = '', value: string): { name: string, message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field, value }, message)
        }
    }
}

export default Min;