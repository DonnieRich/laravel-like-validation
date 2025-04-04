import BaseRule from "../base/BaseRule.js";

class Nullable extends BaseRule {
    protected error = 'The {field} field may be null';

    async validate(data: { [s: string]: any }, field: string): Promise<boolean> {
        return true;
    }

    message(field: string, message: string = ''): { name: string, message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field }, message)
        }
    }
}

export default Nullable;