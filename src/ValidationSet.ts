import BaseRule from './base/BaseRule.js';
import BaseValidationSet from './base/BaseValidationSet.js';

class ValidationSet extends BaseValidationSet {

    add(r: BaseRule | BaseRule[]): void {

        if (Array.isArray(r)) {
            r.forEach(rule => {
                this.rules[rule.getName()] = rule;
            });
        } else {
            this.rules[r.getName()] = r;
        }

    }

}

export default ValidationSet