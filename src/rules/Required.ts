import BaseRule from "../base/BaseRule.js";

class Required extends BaseRule {
    protected error = 'The {field} field is required';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {

        return (
            (typeof data[field] !== 'undefined') &&
            (typeof data[field] === 'string' && data[field].trim() !== '') ||
            (Array.isArray(data[field]) && data[field].length > 0) ||
            (
                typeof data[field] === 'object' && data[field] !== null && Object.keys(data[field]).length > 0
            )
        )
    }

    message(field: string, message: string = '', value?: any): { name: string, message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }

}

export default Required