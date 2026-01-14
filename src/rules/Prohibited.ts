import BaseRule from '../base/BaseRule.js';

class Prohibited extends BaseRule {
    protected error = 'The {field} field must be missing or empty';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {

        if (data[field] === null || typeof data['field'] === 'undefined') {
            return true;
        }

        const isArray = Array.isArray(data[field]);
        const isString = typeof data[field] === "string";

        if (isArray || isString) {
            return data[field].length === 0;
        }

        return false;
    }

    message(field: string, message: string = ''): { name: string; message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message),
        };
    }
}

export default Prohibited;