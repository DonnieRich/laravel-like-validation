import BaseRule from '../base/BaseRule.js';

class Accepted extends BaseRule {
    protected error = 'The {field} field must be accepted';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {
        return data[field] === true || data[field].toLowerCase() === 'true' || data[field] === 1 || data[field] === '1' || data[field].toLowerCase() === 'yes' || data[field].toLowerCase() === 'on';
    }

    message(field: string, message: string = ''): { name: string; message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message),
        };
    }
}

export default Accepted;