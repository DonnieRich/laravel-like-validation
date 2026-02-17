import BaseRule from "../base/BaseRule.js";
import type { ParsedRule } from "../types/ParsedRule.js";
import FunctionRuleStrategy from "./FunctionRuleStrategy.js";
import BaseRuleStrategy from "./BaseRuleStrategy.js";
import StringWithParamsRuleStrategy from "./StringWithParamsRuleStrategy.js";
import StringRuleStrategy from "./StringRuleStrategy.js";
import type { RuleParserContext } from "./IRuleStrategy.js";
import type { OptionalFields } from "../types/OptionalFields.js";
import type { IValidationSet } from "../contracts/IValidationSet.js";

class RuleParser {
    validationSet: IValidationSet = null as any;
    customMessages: { [k: string]: string } = {};
    customAttributes: { [k: string]: string } = {};
    optionalFields: OptionalFields = { body: {}, params: {}, query: {} };
    currentValidationKey: string = '';
    data: {} = {};

    addValidationSet(validationSet: IValidationSet) {
        this.validationSet = validationSet;
        return this;
    }

    addCustomMessages(customMessages: { [k: string]: string }) {
        this.customMessages = customMessages;
        return this;
    }

    addCustomAttributes(customAttributes: { [k: string]: string }) {
        this.customAttributes = customAttributes;
        return this;
    }

    addOptionalFields(optionalFields: OptionalFields) {
        this.optionalFields = optionalFields;
        return this;
    }

    addCurrentValidationKey(currentValidationKey: string) {
        this.currentValidationKey = currentValidationKey;
        return this;
    }

    addData(data: {}) {
        this.data = data;
        return this;
    }

    private getContext(): RuleParserContext {
        return {
            validationSet: this.validationSet,
            customMessages: this.customMessages,
            customAttributes: this.customAttributes,
            optionalFields: this.optionalFields,
            currentValidationKey: this.currentValidationKey,
            data: this.data
        } as RuleParserContext;
    }

    parse(rule: string | Function | BaseRule, key: string): [ParsedRule, OptionalFields] {
        const ctx = this.getContext();

        if (typeof rule === 'function') {
            const s = new FunctionRuleStrategy();
            return s.getRule(rule, key, ctx);
        }

        if (rule instanceof BaseRule) {
            const s = new BaseRuleStrategy();
            return s.getRule(rule, key, ctx);
        }

        if (typeof rule === 'string') {
            return this.parseStringRule(rule, key);
        }

        return [this.getGeneralInvalidRule(rule, key), this.optionalFields];
    }

    private parseStringRule(rule: string, key: string): [ParsedRule, OptionalFields] {
        const validations = this.validationSet.getRules();

        if (rule.match(/[a-z]+:.+/)) {
            const [ruleKey] = this.validationSet.matchRule(rule);
            if (validations[ruleKey]) {
                const s = new StringWithParamsRuleStrategy();
                return s.getRule(rule, key, this.getContext());
            }
        }

        if (validations[rule]) {
            const s = new StringRuleStrategy();
            return s.getRule(rule, key, this.getContext());
        }

        return [this.getGeneralInvalidRule(rule, key), this.optionalFields];
    }

    private getGeneralInvalidRule(rule: string | Function | BaseRule, key: string): ParsedRule {
        return {
            rule: null,
            callValidation: async () => false,
            callMessage: () => ({ name: rule as string, message: `Invalid rule ${rule} applied to ${key}` }),
            isCustomFunction: false
        };
    }
}

export default RuleParser;
