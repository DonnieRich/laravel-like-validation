import type { IValidationSet } from "../contracts/IValidationSet";
import Required = require("../rules/Required");
import type { RulesSet } from "../types/RulesSet";
import BaseRule = require("./BaseRule");

abstract class BaseValidationSet implements IValidationSet {
    protected rules: RulesSet;

    constructor(rules?: RulesSet) {
        this.rules = rules ?? this.defaultRules();
    }

    private defaultRules(): RulesSet {
        const required = new Required();

        return {
            [required.getName()]: required
        };
    }

    abstract add(rule: BaseRule): void;
    abstract add(rule: BaseRule[]): void;

    getRules(): RulesSet {
        return this.rules;
    }

    matchRule(r: string): string[] {
        const regex = /^([^:]+):(.*)$/;
        const match = r.match(regex);

        return [match![1], match![2]];
    }
}

export = BaseValidationSet