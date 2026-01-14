import BaseRule from "./BaseRule.js";

abstract class ConditionalRule extends BaseRule {
    protected fieldToCheck: string | null = null;
    protected valueToCheck: any = null;

    field(field: string) {
        this.fieldToCheck = field;
        return this;
    }

    value(value: any) {
        this.valueToCheck = value;
        return this;
    }

    protected getFieldAndValue(value: any): any[] {

        if (value) {
            return this.parseValue(value);
        }

        return [
            this.fieldToCheck,
            this.valueToCheck
        ]
    }

    protected compareValues(value: any, valueToCheck: any): boolean {

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

    protected checkForUndefined(data: { [s: string]: any }, field: string): boolean {
        return typeof data[field] === 'undefined' || data[field] === null;
    }
}

export default ConditionalRule;