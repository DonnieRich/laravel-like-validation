import BaseRule = require("../base/BaseRule");

class Required extends BaseRule {
    error = 'The {field} field is required';

    validate(data: { [s: string]: any }, field: string) {

        return (
            (typeof data[field] !== 'undefined') &&
            (typeof data[field] === 'string' && data[field].trim() !== '') ||
            (Array.isArray(data[field]) && data[field].length > 0) ||
            (
                typeof data[field] === 'object' && data[field] !== null && Object.keys(data[field]).length > 0
            )
        )
    }

    message(field: string, message: string = '', value?: any) {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }

}

export = Required