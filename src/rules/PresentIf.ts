import BaseRule from "../base/BaseRule.js";
import ValidationError from "../errors/ValidationError.js";

class PresentIf extends BaseRule {
    error = "The {field} field must be present if the field {fieldToCheck} has a value of {valueToCheck}"

    private fieldToCheck: string | null = null;
    private valueToCheck: any = null;

    field(field: string) {
        this.fieldToCheck = field;
        return this;
    }

    value(value: any) {
        this.valueToCheck = value;
        return this;
    }

    private getFieldAndValue(value: any): any[] {

        if (value) {
            return this.parseValue(value);
        }

        return [
            this.fieldToCheck,
            this.valueToCheck
        ]
    }

    async validate(data: { [s: string]: any }, field: string, value?: string): Promise<boolean> {
        const [fieldToCheck, valueToCheck] = this.getFieldAndValue(value);

        if (this.compareValues(data[fieldToCheck], valueToCheck)) {

            if (this.checkForUndefined(data, field)) {
                return false;
            } else {
                return true;
            }

        }

        return true;
    }

    private compareValues(value: any, valueToCheck: any): boolean {

        let convertedValue = value;
        let convertedValueToCheck = valueToCheck;

        if (typeof value === 'object' && value !== null) {
            convertedValue = JSON.stringify(value);
        }
        if (typeof valueToCheck === 'object' && valueToCheck !== null) {
            convertedValueToCheck = JSON.stringify(valueToCheck);
        }

        if (typeof value === 'number') {
            convertedValue = value.toString();
        }
        if (typeof valueToCheck === 'number') {
            convertedValueToCheck = valueToCheck.toString();
        }

        if (typeof value === 'boolean') {
            convertedValue = value ? 'true' : 'false';
        }
        if (typeof valueToCheck === 'boolean') {
            convertedValueToCheck = valueToCheck ? 'true' : 'false';
        }

        return convertedValue === convertedValueToCheck;
    }

    private checkForUndefined(data: { [s: string]: any }, field: string): boolean {
        return typeof data[field] === 'undefined' || data[field] === null;
    }

    message(field: string, message: string = '', value?: string): { name: string, message: string } {
        const [fieldToCheck, valueToCheck] = this.getFieldAndValue(value);

        return {
            name: this.getName(),
            message: this.generateMessage({ field, fieldToCheck, valueToCheck }, message)
        }
    }
}

export default PresentIf