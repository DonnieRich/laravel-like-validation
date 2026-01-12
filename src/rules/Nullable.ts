import BaseRule from "../base/BaseRule.js";

class Nullable extends BaseRule {
    protected error = 'The {field} field may be null';
    protected optional = true;

    validate(data: { [s: string]: any }, field: string): boolean {
        // nullable should not fail validation itself except when the
        // field is missing or explicitly undefined. It should allow
        // a field to be null (so other validations are skipped).
        if (!Object.prototype.hasOwnProperty.call(data, field)) {
            return false;
        }

        const value = data[field as keyof typeof data];

        // allow explicit null, but not undefined
        return value === null || typeof value !== 'undefined';
    }

    message(field: string, message: string = ''): { name: string, message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }
}

export default Nullable;