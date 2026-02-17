import type BaseRule from "../base/BaseRule.js";
import type { ParsedRule } from "../types/ParsedRule.js";
import type { IValidationSet } from "../contracts/IValidationSet.js";
import type { ErrorKeysType } from "../types/ValidationKeys.js";
import type { OptionalFields } from "../types/OptionalFields.js";

export interface RuleParserContext {
    validationSet: IValidationSet;
    customMessages: { [k: string]: string };
    customAttributes: { [k: string]: string };
    optionalFields: OptionalFields;
    currentValidationKey: ErrorKeysType;
    data: {};
}

export interface IRuleStrategy {
    getRule(rule: string | Function | BaseRule, key: string, ctx: RuleParserContext): [ParsedRule, OptionalFields];
}