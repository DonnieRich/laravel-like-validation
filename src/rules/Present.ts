import BaseRule from '../base/BaseRule.js';

class Present extends BaseRule {
    protected error = 'The {field} field must be present in the input data';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {
        return field in data;
    }

    message(field: string, message: string = ''): { name: string; message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message),
        };
    }
}

export default Present;