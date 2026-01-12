// implement here the rules parsing from the BaseValidator
// it should return an array of promises
// it should manage optional rules
// it should manage excluded fields

import type { IRuleObject } from "../contracts/IRuleObject.js";
import type { IValidationSet } from "../contracts/IValidationSet.js";
import BaseRule from "../base/BaseRule.js";
import type { ParsedRule } from "../types/ParsedRule.js";

type ValidationArguments = {
    customRules: IRuleObject,
    customMessages: { [key: string]: string },
    customAttributes: { [key: string]: string }
}

class RuleParser {

    protected foundInvalidRule: Boolean = false;

    private data: {} = {};

    protected customRules: IRuleObject = {
        body: {},
        params: {},
        query: {}
    };

    protected customMessages: {
        [k: string]: string
    } = {};

    protected customAttributes: {
        [k: string]: string
    } = {};

    protected validationSet: IValidationSet;

    constructor({ customRules, customMessages, customAttributes }: ValidationArguments, validationSet: IValidationSet) {
        this.customRules = customRules;
        this.customMessages = customMessages;
        this.customAttributes = customAttributes;
        this.validationSet = validationSet;
    }

    private getRule(rule: string | Function | BaseRule, key: string): ParsedRule {

        const field = this.customAttributes[key] ?? key;
        // TODO: move this out of this method
        const validations = this.validationSet.getRules();

        // check if rule is optional (i.e. nullable, sometimes, etc...)
        // if the optional validation return true (i.e. field is null or undefined), the following validation rules should be ignored
        // tags: 'nullable|is_array|max:3' -> if tags is null, no need to check for is_array or max

        if (typeof rule === 'function') {

            const result: ParsedRule = {
                rule: "function",
                callValidation: async () => await rule(this.data, key),
                isCustomFunction: true
            }

            return result;

        } else if (rule instanceof BaseRule || typeof rule === 'string') {

            const result: ParsedRule = {
                rule: null,
                callValidation: async () => false,
                callMessage: () => ({ name: rule as string, message: `Invalid rule ${rule} applied to ${key}` }),
                isCustomFunction: false
            }

            if (rule instanceof BaseRule) {

                const message = this.customMessages[`${key}.${rule.getName()}`] ?? this.customMessages[rule.getName()];
                result.rule = rule.getName();
                result.callValidation = async () => await rule.validate(this.data, key);
                result.callMessage = () => rule.message(field, message);

            } else if (typeof rule === 'string') {

                if (rule.match(/[a-z]+:.+/)) {

                    const [ruleKey, value] = this.validationSet.matchRule(rule);
                    const message = this.customMessages[`${key}.${ruleKey}`] ?? this.customMessages[ruleKey];
                    result.rule = validations[ruleKey].getName();
                    result.callValidation = async () => await validations[ruleKey].validate(this.data, key, value);
                    result.callMessage = () => validations[ruleKey].message(field, message, value);

                } else if (validations[rule]) {

                    const message = this.customMessages[`${key}.${rule}`] ?? this.customMessages[rule];
                    result.rule = validations[rule].getName();
                    result.callValidation = async () => await validations[rule].validate(this.data, key);
                    result.callMessage = () => validations[rule].message(field, message);

                }

            }

            return result;

        } else {
            this.foundInvalidRule = true;

            return {
                rule: null,
                callValidation: async () => false,
                callMessage: () => ({ name: rule as string, message: `Invalid rule ${rule} applied to ${key}` }),
                isCustomFunction: false
            };
        }

    }
}