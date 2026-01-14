import ConditionalRule from '../base/ConditionalRule.js';

class ProhibitedIf extends ConditionalRule {
    protected error = 'The {field} field must be missing or empty if the field {fieldToCheck} has a value of {valueToCheck}';
    protected optional = true;

    async validate(data: { [s: string]: any }, field: string, value?: string): Promise<boolean> {
        const [fieldToCheck, valueToCheck] = this.getFieldAndValue(value);

        if (this.compareValues(data[fieldToCheck], valueToCheck)) {

            if (!(field in data)) {
                return true;
            }
    
            if (data[field] === null) {
                return true;
            }
    
            const isArray = Array.isArray(data[field]);
            const isString = typeof data[field] === "string";
    
            if (isArray || isString) {
                return data[field].length === 0;
            }
        }


        return true;
    }

    message(field: string, message: string = '', value?: string): { name: string; message: string } {
        const [fieldToCheck, valueToCheck] = this.getFieldAndValue(value);

        return {
            name: this.getName(),
            message: this.generateMessage({ field, fieldToCheck, valueToCheck }, message),
        };
    }
}

export default ProhibitedIf;