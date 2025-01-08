import BaseRule from "../base/BaseRule.js";

class Max extends BaseRule {
    protected isInvalid = false;
    protected error = "The {field} must have a max length of {value}"

    validate(data: { [s: string]: any }, field: string, value: string) {
        const length = this.getFieldValue(data[field]);

        if (this.isInvalid) {
            this.error = "The field under validation ({field}) must be of type: Array, String or Number";
            return false;
        }

        return length <= parseInt(value)
    }

    message(field: string, message: string = '', value: string) {
        return {
            name: this.getName(),
            message: this.generateMessage({ field, value }, message)
        }
    }

    protected getFieldValue(originalValue: any): number {
        let value = 0;

        if (Array.isArray(originalValue)) {
            value = originalValue.length;
        } else if (typeof originalValue === 'string') {
            value = originalValue.trim().length;
        } else if (typeof originalValue === 'number') {
            value = originalValue;
        } else {
            this.isInvalid = true;
        }

        return value;
    }
}

export default Max;