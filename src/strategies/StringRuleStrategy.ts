import type BaseRule from "../base/BaseRule.js";
import type { OptionalFields } from "../types/OptionalFields.js";
import type { ParsedRule } from "../types/ParsedRule.js";
import type { IRuleStrategy, RuleParserContext } from "./IRuleStrategy.js";

class StringRuleStrategy implements IRuleStrategy {
    getRule(rule: string | Function | BaseRule, key: string, ctx: RuleParserContext): [ParsedRule, OptionalFields] {
        const str = rule as string;
        const validations = ctx.validationSet.getRules();
        const message = ctx.customMessages[`${key}.${str}`] ?? ctx.customMessages[str];

        const result: ParsedRule = {
            rule: validations[str].getName(),
            callValidation: async () => await validations[str].validate(ctx.data, key),
            callMessage: () => validations[str].message(ctx.customAttributes[key] ?? key, message),
            isCustomFunction: false
        } as any;

        if (validations[str] && typeof validations[str].isOptional === 'function' && validations[str].isOptional()) {
            ctx.optionalFields[ctx.currentValidationKey][key] = true;
        }

        return [result, ctx.optionalFields];
    }
}

export default StringRuleStrategy;
