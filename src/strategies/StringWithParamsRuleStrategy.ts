import type BaseRule from "../base/BaseRule.js";
import type { OptionalFields } from "../types/OptionalFields.js";
import type { ParsedRule } from "../types/ParsedRule.js";
import type { IRuleStrategy, RuleParserContext } from "./IRuleStrategy.js";

class StringWithParamsRuleStrategy implements IRuleStrategy {
    getRule(rule: string | Function | BaseRule, key: string, ctx: RuleParserContext): [ParsedRule, OptionalFields] {
        const str = rule as string;
        const validations = ctx.validationSet.getRules();
        const [ruleKey, value] = ctx.validationSet.matchRule(str);
        const message = ctx.customMessages[`${key}.${ruleKey}`] ?? ctx.customMessages[ruleKey];

        const result: ParsedRule = {
            rule: validations[ruleKey].getName(),
            callValidation: async () => await validations[ruleKey].validate(ctx.data, key, value),
            callMessage: () => validations[ruleKey].message(ctx.customAttributes[key] ?? key, message, value),
            isCustomFunction: false
        };

        if (validations[ruleKey] && typeof validations[ruleKey].isOptional === 'function' && validations[ruleKey].isOptional()) {
            ctx.optionalFields[ctx.currentValidationKey][key] = true;
        }

        return [result, ctx.optionalFields];
    }
}

export default StringWithParamsRuleStrategy;
