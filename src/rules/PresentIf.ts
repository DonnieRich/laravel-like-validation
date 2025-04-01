import BaseRule from "../base/BaseRule.js";

class PresentIf extends BaseRule {
    error = "The {field} field must be present if the field {anotherField} has a value of {anotherValue}"

    async validate(data: { [s: string]: any }, field: string, value: any): Promise<boolean> {
        const [anotherField, anotherValue] = !Array.isArray(value) ? this.parseValue(value) : value;

        if (this.checkForUndefined(data, anotherField)) {
            return false;
        }

        if (this.checkForUndefined(data, field)) {
            return false;
        }

        if (this.compareValues(data[anotherField], anotherValue)) {
            return true;
        }

        return false;
    }

    private compareValues(value: any, anotherValue: any): boolean {

        let convertedValue = value;
        let convertedAnotherValue = anotherValue;

        if (typeof value === 'object' && value !== null) {
            convertedValue = JSON.stringify(value);
        }
        if (typeof anotherValue === 'object' && anotherValue !== null) {
            convertedAnotherValue = JSON.stringify(anotherValue);
        }

        if (typeof value === 'number') {
            convertedValue = value.toString();
        }
        if (typeof anotherValue === 'number') {
            convertedAnotherValue = anotherValue.toString();
        }

        if (typeof value === 'boolean') {
            convertedValue = value ? 'true' : 'false';
        }
        if (typeof anotherValue === 'boolean') {
            convertedAnotherValue = anotherValue ? 'true' : 'false';
        }

        return convertedValue === convertedAnotherValue;
    }

    private checkForUndefined(data: { [s: string]: any }, field: string): boolean {
        return typeof data[field] === 'undefined' || data[field] === null;
    }

    message(field: string, message: string = '', value: Array<any>): { name: string, message: string } {
        const [anotherField, anotherValue] = !Array.isArray(value) ? this.parseValue(value) : value;
        return {
            name: this.getName(),
            message: this.generateMessage({ field, anotherField, anotherValue }, message)
        }
    }
}

export default PresentIf