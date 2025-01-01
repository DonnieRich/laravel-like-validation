import RegexParser from "regex-parser";
import BaseRule from "../base/BaseRule.js";

class RegexMatch extends BaseRule {
    error = "The {field} value must match the pattern {value}"

    validate(data: { [s: string]: any }, field: string, value: string) {
        const regex = new RegExp(RegexParser(value));
        return typeof data[field] === 'string' && regex.test(data[field]);
    }

    message(field: string, message: string = '', value: string) {
        return {
            name: this.getName(),
            message: this.generateMessage({ field, value }, message)
        }
    }

}

export default RegexMatch