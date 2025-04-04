import type { IValidationSet } from "../contracts/IValidationSet.js";
import IsArray from "../rules/IsArray.js";
import Max from "../rules/Max.js";
import Min from "../rules/Min.js";
import Numeric from "../rules/Numeric.js";
import PresentIf from "../rules/PresentIf.js";
import RegexMatch from "../rules/RegexMatch.js";
import Required from "../rules/Required.js";
import Nullable from "../rules/Nullable.js";
import type { RulesSet } from "../types/RulesSet.js";
import BaseRule from "./BaseRule.js";
import Accepted from "../rules/Accepted.js";
import Alpha from "../rules/Alpha.js";
import CastBoolean from "../rules/CastBoolean.js";
import Present from "../rules/Present.js";
import Between from "../rules/Between.js";
import Declined from "../rules/Declined.js";

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
        const nullable = new Nullable();
        const accepted = new Accepted();
        const alpha = new Alpha();
        const boolean = new CastBoolean();
        const present = new Present();
        const between = new Between();
        const declined = new Declined();

        return {
            [required.getName()]: required,
            [regexMatch.getName()]: regexMatch,
            [max.getName()]: max,
            [min.getName()]: min,
            [isArray.getName()]: isArray,
            [numeric.getName()]: numeric,
            [presentIf.getName()]: presentIf,
            [nullable.getName()]: nullable,
            [accepted.getName()]: accepted,
            [alpha.getName()]: alpha,
            [boolean.getName()]: boolean,
            [present.getName()]: present,
            [between.getName()]: between,
            [declined.getName()]: declined,
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