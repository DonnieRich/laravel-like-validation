import BaseRule from "../base/BaseRule.js";

class Numeric extends BaseRule {
    protected error = 'The {field} field must be a number';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {
        return isNaN(Number(data[field])) === false;
    }

    message(field: string, message: string = ''): { name: string, message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }
}

export default Numeric