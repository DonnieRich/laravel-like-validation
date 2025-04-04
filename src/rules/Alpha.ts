import BaseRule from '../base/BaseRule.js';

class Alpha extends BaseRule {
    protected error = 'The {field} field must be entirely Unicode alphabetic characters contained in the Unicode General Category Letter (L) or Mark (M)';

    async validate(data: { [s: string]: any }, field: string, value?: "ascii"): Promise<boolean> {

        if (value === 'ascii') {
            this.error = 'The {field} field must be entirely ASCII alphabetic characters (a-zA-Z)';
            return /^[a-zA-Z]+$/.test(data[field]);
        }

        return /\p{L}|\p{M}/u.test(data[field]);
    }

    message(field: string, message: string = ''): { name: string; message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message),
        };
    }
}

export default Alpha;