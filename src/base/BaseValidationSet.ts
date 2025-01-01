import type { IValidationSet } from "../contracts/IValidationSet.js";
import RegexMatch from "../rules/RegexMatch.js";
import Required from "../rules/Required.js";
import type { RulesSet } from "../types/RulesSet.js";
import BaseRule from "./BaseRule.js";

abstract class BaseValidationSet implements IValidationSet {
    protected rules: RulesSet;

    constructor(rules?: RulesSet) {
        this.rules = rules ?? this.defaultRules();
    }

    private defaultRules(): RulesSet {
        const required = new Required();
        const regexMatch = new RegexMatch();

        return {
            [required.getName()]: required,
            [regexMatch.getName()]: regexMatch,
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

export default BaseValidationSet