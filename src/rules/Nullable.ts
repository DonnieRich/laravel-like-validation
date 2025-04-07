import BaseRule from "../base/BaseRule.js";

class Nullable extends BaseRule {
    protected error = 'The {field} field may be null';

    validate(data: { [s: string]: any }, field: string): boolean {
        return typeof data[field] !== "undefined";
    }

    message(field: string, message: string = ''): { name: string, message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }
}

export default Nullable;