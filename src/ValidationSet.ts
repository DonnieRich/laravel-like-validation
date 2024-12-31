import BaseRule = require('./base/BaseRule');
import BaseValidationSet = require('./base/BaseValidationSet');

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

export = ValidationSet