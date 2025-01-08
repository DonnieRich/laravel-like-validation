import type { IValidationSet } from "../contracts/IValidationSet.js";
import IsArray from "../rules/IsArray.js";
import Max from "../rules/Max.js";
import Min from "../rules/Min.js";
import Numeric from "../rules/Numeric.js";
import PresentIf from "../rules/PresentIf.js";
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
        const max = new Max();
        const min = new Min();
        const isArray = new IsArray();
        const numeric = new Numeric();
        const presentIf = new PresentIf();

        return {
            [required.getName()]: required,
            [regexMatch.getName()]: regexMatch,
            [max.getName()]: max,
            [min.getName()]: min,
            [isArray.getName()]: isArray,
            [numeric.getName()]: numeric,
            [presentIf.getName()]: presentIf
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

    parseValue(value: string): string | string[] {
        if (value.includes(',')) {
            return value.split(',');
        }

        return value;
    }
}

export default BaseValidationSet