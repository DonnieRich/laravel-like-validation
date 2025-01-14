import RegexParser from "regex-parser";
import BaseRule from "../base/BaseRule.js";

class RegexMatch extends BaseRule {
    protected error = "The {field} value must match the pattern {value}"

    async validate(data: { [s: string]: any }, field: string, value: string): Promise<boolean> {
        const regex = new RegExp(RegexParser(value));
        return typeof data[field] === 'string' && regex.test(data[field]);
    }

    message(field: string, message: string = '', value: string): { name: string, message: string } {
        return {
            name: this.getName(),
            message: this.generateMessage({ field, value }, message)
        }
    }

}

export default RegexMatch