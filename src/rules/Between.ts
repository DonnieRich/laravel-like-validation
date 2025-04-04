import BaseRule from '../base/BaseRule.js';
import Max from './Max.js';
import Min from './Min.js';

class Between extends BaseRule {
    protected error = 'The {field} field must be between {minValue} and {maxValue}';

    protected maxValue: number = Infinity;
    protected minValue: number = -Infinity;

    min(value: number): this {
        this.minValue = value;
        return this;
    }

    max(value: number): this {
        this.maxValue = value;
        return this;
    }

    private getMinMaxValues(value?: string): any[] {
        if (value) {
            return this.parseValue(value).map(v => {

                if (typeof v === 'string') {
                    v = v.trim();

                    if (v.length === 0) {
                        return undefined;
                    }
                }

                return Number(v)
            });
        }

        return [
            this.minValue,
            this.maxValue
        ];
    }

    private checkForArrayStringNumber(value: any): boolean {

        if (Array.isArray(value)) return true;
        if (typeof value === 'string') return true;
        if (!isNaN(Number(value))) return true;

        console.log('invalid value', value)

        return false;
    }

    async validate(data: { [s: string]: any }, field: string, value?: string): Promise<boolean> {
        const [min, max] = this.getMinMaxValues(value);

        if (min > max) {
            this.error = 'The min value must be less or equal than the max value.';
            return false;
        }

        if (typeof min === "undefined" || typeof max === "undefined") {
            this.error = 'The min and max values must both be defined.';
            return false;
        }

        if (!this.checkForArrayStringNumber(data[field])) {
            console.log('invalid field')
            this.error = 'The field under validation ({field}) must be of type: Array, String or Number';
            return false;
        }

        const minValidation = await new Min().validate(data, field, min);
        const maxValidation = await new Max().validate(data, field, max);

        return minValidation && maxValidation;
    }

    message(field: string, message: string = '', value?: string): { name: string; message: string } {
        const [min, max] = this.getMinMaxValues(value);
        return {
            name: this.getName(),
            message: this.generateMessage({ field, min, max }, message),
        };
    }
}

export default Between;