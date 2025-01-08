import BaseRule from "../base/BaseRule.js";

class IsArray extends BaseRule {
    protected error = 'The {field} field must be an array';

    validate(data: { [s: string]: any }, field: string) {
        return Array.isArray(data[field]);
    }

    message(field: string, message: string = '') {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }
}

export default IsArray