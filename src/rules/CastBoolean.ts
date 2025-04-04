import BaseRule from '../base/BaseRule.js';

class CastBoolean extends BaseRule {
    protected error = 'The {field} field must be able to be cast as a boolean';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {
        return data[field] === true || data[field] === false || data[field] === 1 || data[field] === 0 || data[field] === '1' || data[field] === '0';
    }

    message(field: string, message: string = ''): { name: string; message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message),
        };
    }

    getName() {
        return 'boolean';
    }
}

export default CastBoolean;