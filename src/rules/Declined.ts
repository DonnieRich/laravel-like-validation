import BaseRule from '../base/BaseRule.js';

class Declined extends BaseRule {
    protected error = 'The {field} field must be declined';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {
        return data[field] === false || data[field].toLowerCase() === 'false' || data[field] === 0 || data[field] === '0' || data[field].toLowerCase() === 'no' || data[field].toLowerCase() === 'off';
    }

    message(field: string, message: string = ''): { name: string; message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message),
        };
    }
}

export default Declined;