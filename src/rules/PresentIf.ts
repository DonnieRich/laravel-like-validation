import ConditionalRule from "../base/ConditionalRule.js";

class PresentIf extends ConditionalRule {
    error = "The {field} field must be present if the field {fieldToCheck} has a value of {valueToCheck}"

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

    message(field: string, message: string = '', value?: string): { name: string, message: string } {
        const [fieldToCheck, valueToCheck] = this.getFieldAndValue(value);

        return {
            name: this.getName(),
            message: this.generateMessage({ field, fieldToCheck, valueToCheck }, message)
        }
    }
}

export default PresentIf