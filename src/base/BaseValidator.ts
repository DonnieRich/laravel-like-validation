import BaseRule from "./BaseRule.js";
import type { IValidationSet } from "../contracts/IValidationSet.js";
import type { IValidationRequest } from "../contracts/IValidationRequest.js"
import ValidationSet from "../ValidationSet.js";
import type { IRuleObject } from "../contracts/IRuleObject.js";
import type { IParsedRule } from "../contracts/IParsedRule.js";
import type { IValidator } from "../contracts/IValidator.js";

abstract class BaseValidator implements IValidator {
    private validationSet!: IValidationSet;

    private errors: {
        body: { [k: string]: object },
        params: { [k: string]: object },
        query: { [k: string]: object }
    } = {
            body: {},
            params: {},
            query: {}
        };

    protected rules: IRuleObject = {
        body: {},
        params: {},
        query: {}
    };

    protected messages: {
        [k: string]: string
    } = {};

    protected attributes: {
        [k: string]: string
    } = {};

    protected fail: (error: object, exit: boolean) => void = (error, exit = false) => { return };

    private data: {} = {};

    private currentValidation: keyof typeof this.errors = 'body';
    private bail: boolean = false;

    protected stopOnFirstError: boolean = false;

    constructor() {
        this.rules = this.getRules();
        this.messages = this.getMessages();
        this.attributes = this.getAttributes();
    }

    public applyValidationSet(validationSet: IValidationSet): void {
        this.validationSet = validationSet;
    }

    public getRules(): IRuleObject {
        return {
            body: {},
            params: {},
            query: {}
        }
    }

    public getMessages(): { [k: string]: string } {
        return {}
    }

    public getAttributes(): { [k: string]: string } {
        return {}
    }

    private reset(): void {
        this.data = {};
        this.currentValidation = 'body';
    }

    private beforeValidate(): void {
        this.errors = {
            body: {},
            params: {},
            query: {}
        };
        this.reset();
    }

    private afterValidate(): void {
        this.reset();
    }

    private generateValidationErrors(): object {
        const errors: {
            body?: {},
            params?: {},
            query?: {}
        } = {};

        if (Object.keys(this.errors.body).length > 0) {
            errors.body = { ...this.errors.body }
        }

        if (Object.keys(this.errors.params).length > 0) {
            errors.params = { ...this.errors.params }
        }

        if (Object.keys(this.errors.query).length > 0) {
            errors.query = { ...this.errors.query }
        }

        return errors;
    }

    private addError(key: string, error: { name: string, message: string }): void {
        this.errors[this.currentValidation][key] = { [error.name]: error.message, ...this.errors[this.currentValidation][key] };
    }

    private getRule(rule: string | Function | BaseRule | [BaseRule, any], key: string): IParsedRule {
        const field = this.attributes[key] ?? key;

        const result: IParsedRule = {
            rule: null,
            callValidation: async () => false,
            callMessage: null
        }

        const validations = this.validationSet.getRules();

        if (typeof rule === 'string') {

            if (rule.match(/[a-z]+:.+/)) {
                const [ruleKey, value] = this.validationSet.matchRule(rule);
                const message = this.messages[`${key}.${ruleKey}`] ?? this.messages[ruleKey];
                result.rule = validations[ruleKey].getName();
                result.callValidation = async () => await validations[ruleKey].validate(this.data, key, value);
                result.callMessage = () => validations[ruleKey].message(field, message, value);
            } else if (validations[rule]) {
                const message = this.messages[`${key}.${rule}`] ?? this.messages[rule];
                result.rule = validations[rule].getName();
                result.callValidation = async () => await validations[rule].validate(this.data, key);
                result.callMessage = () => validations[rule].message(field, message);
            }
        }

        if (rule instanceof BaseRule) {
            const message = this.messages[`${key}.${rule.getName()}`] ?? this.messages[rule.getName()];
            result.rule = rule.getName();
            result.callValidation = async () => await rule.validate(this.data, key);
            result.callMessage = () => rule.message(field, message);
        } else if (typeof rule === 'function') {
            result.rule = typeof rule;
            result.callValidation = async () => await rule(this.data, { key, current: this.currentValidation }, this.fail);
            result.callMessage = null;
        }

        if (Array.isArray(rule)) {
            if (rule[0] instanceof BaseRule) {
                const values = rule.slice(1);
                const message = this.messages[`${key}.${rule[0].getName()}`] ?? this.messages[rule[0].getName()];
                result.rule = rule[0].getName();
                result.callValidation = async () => await rule[0].validate(this.data, key, values);
                result.callMessage = () => rule[0].message(field, message, values);
            }
        }

        if (result.rule === null) {
            throw new Error(`Invalid rule ${rule} applied to ${key}`);
        }

        return result;
    }

    private async applyValidation(data: object): Promise<void> {
        this.errors[this.currentValidation] = {};
        this.data = data;

        let prevKey = '';
        for (const key in this.rules[this.currentValidation]) {

            if (key !== prevKey) {
                this.bail = false
            }

            const rules = [];

            if (typeof this.rules[this.currentValidation][key] === 'string') {
                rules.push(...(this.rules[this.currentValidation][key] as string).split('|'))
            } else if (Array.isArray(this.rules[this.currentValidation][key])) {
                rules.push(...this.rules[this.currentValidation][key])
            }

            const promises = rules.map(async rule => {
                if (typeof rule === 'string' && rule === 'bail') {
                    this.bail = true
                    return
                }

                const v = this.getRule(rule, key);

                const validationResult = await v.callValidation();
                if (!validationResult) {

                    if (v.callMessage) {
                        const error = v.callMessage();

                        this.addError(key, error);

                        if (this.bail || this.stopOnFirstError) {
                            this.fail({ [this.currentValidation]: { [key]: error } }, true)
                        }
                    }

                }

                return validationResult;
            })

            await Promise.all(promises);

        }
    }

    private async validateBody(data: object | undefined): Promise<void> {
        if (this.rules.body && data) {
            this.currentValidation = 'body';
            await this.applyValidation(data);
        }
    }

    private async validateParams(data: object | undefined): Promise<void> {
        if (this.rules.params && data) {
            this.currentValidation = 'params';
            await this.applyValidation(data);
        }
    }

    private async validateQuery(data: object | undefined): Promise<void> {
        if (this.rules.query && data) {
            this.currentValidation = 'query';
            await this.applyValidation(data);
        }
    }

    public async validate(req: IValidationRequest, fail: (error: object, exit: boolean) => void): Promise<void> {
        this.fail = fail;

        this.beforeValidate();

        await this.validateBody(req.body);
        await this.validateParams(req.params);
        await this.validateQuery(req.query);

        this.afterValidate();

        this.fail(this.generateValidationErrors(), false);
    }
}

export default BaseValidator