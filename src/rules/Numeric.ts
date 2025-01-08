import BaseRule from "../base/BaseRule.js";

class Numeric extends BaseRule {
    protected error = 'The {field} field must be a number';

    validate(data: { [s: string]: any }, field: string) {
        return typeof data[field] === 'number';
    }

    message(field: string, message: string = '') {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }
}

export default Numeric