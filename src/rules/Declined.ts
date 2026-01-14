import BaseRule from '../base/BaseRule.js';

class Declined extends BaseRule {
    protected error = 'The {field} field must be declined';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {

        if (data[field] === null || typeof data[field] === 'undefined') {
            return false;
        }

        if (typeof data[field] === 'boolean') {
            return data[field] === false;
        }

        if (typeof data[field] === 'number') {
            return data[field] === 0;
        }

        if (typeof data[field] === 'string') {
            const lowerValue = data[field].toLowerCase();
            return lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no' || lowerValue === 'off';
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

export default Declined;