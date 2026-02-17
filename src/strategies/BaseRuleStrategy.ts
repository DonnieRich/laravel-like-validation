import BaseRule from "../base/BaseRule.js";
import type { OptionalFields } from "../types/OptionalFields.js";
import type { ParsedRule } from "../types/ParsedRule.js";
import type { IRuleStrategy, RuleParserContext } from "./IRuleStrategy.js";

class BaseRuleStrategy implements IRuleStrategy {
    getRule(rule: string | Function | BaseRule, key: string, ctx: RuleParserContext): [ParsedRule, OptionalFields] {
        const r = rule as BaseRule;
        const field = ctx.customAttributes[key] ?? key;

        const message = ctx.customMessages[`${key}.${r.getName()}`] ?? ctx.customMessages[r.getName()];

        const result: ParsedRule = {
            rule: r.getName(),
            callValidation: async () => await r.validate(ctx.data, key),
            callMessage: () => r.message(field, message),
            isCustomFunction: false
        } as any;

        if (typeof r.isOptional === 'function' && r.isOptional()) {
            ctx.optionalFields[ctx.currentValidationKey][key] = true;
        }

        return [result, ctx.optionalFields];
    }
}

export default BaseRuleStrategy;
