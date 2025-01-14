import BaseRule from "../base/BaseRule.js";

class PresentIf extends BaseRule {
    error = "The {field} field must be present if the field {anotherField} has a value of {anotherValue}"

    async validate(data: { [s: string]: any }, field: string, value: Array<string>): Promise<boolean> {
        const [anotherField, anotherValue] = value;

        return (
            typeof data[anotherField] === 'undefined' ||
            data[anotherField] != anotherValue ||
            typeof data[field] !== 'undefined' && typeof data[anotherField] !== 'undefined' && data[anotherField] == anotherValue
        );
    }

    message(field: string, message: string = '', value: Array<string>): { name: string, message: string } {
        const [anotherField, anotherValue] = value;
        return {
            name: this.getName(),
            message: this.generateMessage({ field, anotherField, anotherValue }, message)
        }
    }
}

export default PresentIf