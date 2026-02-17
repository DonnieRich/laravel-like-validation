import type BaseRule from "../base/BaseRule.js";
import type { OptionalFields } from "../types/OptionalFields.js";
import type { ParsedRule } from "../types/ParsedRule.js";
import type { IRuleStrategy, RuleParserContext } from "./IRuleStrategy.js";

class FunctionRuleStrategy implements IRuleStrategy {
    getRule(rule: string | Function | BaseRule, key: string, ctx: RuleParserContext): [ParsedRule, OptionalFields] {
        const fn = rule as Function;

        const result: ParsedRule = {
            rule: "function",
            callValidation: async () => await fn(ctx.data, key),
            isCustomFunction: true
        };

        return [result, ctx.optionalFields];
    }
}

export default FunctionRuleStrategy;
