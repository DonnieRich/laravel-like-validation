import BaseRule from "./BaseRule.js";
import type { IValidationSet } from "../contracts/IValidationSet.js";
import type { IValidationRequest } from "../contracts/IValidationRequest.js"
import type { IRuleObject } from "../contracts/IRuleObject.js";
import type { IParsedRule } from "../contracts/IParsedRule.js";
import type { IValidator } from "../contracts/IValidator.js";
import type { Result } from "../types/Result.js";


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

    private validated: {
        body: { [k: string]: object },
        params: { [k: string]: object },
        query: { [k: string]: object }
    } = {
            body: {},
            params: {},
            query: {}
        };

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

    protected fail: (error: object, validated: object) => void = (error, validated) => { return };

    private data: {} = {};

    private currentValidation: keyof typeof this.errors = 'body';

    protected stopOnFirstError: boolean = false;

    constructor() {
        this.customRules = this.rules();
        this.customMessages = this.messages();
        this.customAttributes = this.attributes();
    }

    public applyValidationSet(validationSet: IValidationSet): void {
        this.validationSet = validationSet;
    }

    public rules(): IRuleObject {
        return {
            body: {},
            params: {},
            query: {}
        }
    }

    public messages(): { [k: string]: string } {
        return {}
    }

    public attributes(): { [k: string]: string } {
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

    private getValidationErrors(): object {
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

    private getValidatedData(): object {
        const validated: {
            body?: {},
            params?: {},
            query?: {}
        } = {};

        if (Object.keys(this.validated.body).length > 0) {
            validated.body = { ...this.validated.body }
        }

        if (Object.keys(this.validated.params).length > 0) {
            validated.params = { ...this.validated.params }
        }

        if (Object.keys(this.validated.query).length > 0) {
            validated.query = { ...this.validated.query }
        }

        return validated;
    }

    private addError(key: string, error: { name: string, message: string }): void {
        this.errors[this.currentValidation][key] = { [error.name]: error.message, ...this.errors[this.currentValidation][key] };
    }

    private addValidData(key: string, error: { name: string, message: string }): void {
        this.validated[this.currentValidation][key] = { [error.name]: error.message, ...this.validated[this.currentValidation][key] };
    }

    private getRule(rule: string | Function | BaseRule | [BaseRule, any], key: string): IParsedRule {
        const field = this.customAttributes[key] ?? key;

        const result: IParsedRule = {
            rule: null,
            callValidation: async () => false,
            callMessage: null
        }

        const validations = this.validationSet.getRules();

        if (typeof rule === 'string') {

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

        if (rule instanceof BaseRule) {
            const message = this.customMessages[`${key}.${rule.getName()}`] ?? this.customMessages[rule.getName()];
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
                const message = this.customMessages[`${key}.${rule[0].getName()}`] ?? this.customMessages[rule[0].getName()];
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

    private mapRulesToPromises(rules: (string | Function | BaseRule | [BaseRule, any])[], key: string): Promise<object>[] {

        let lastValidationFailed = false;

        const promises = rules.map(async rule => {


            const v = this.getRule(rule, key);


            return await new Promise<object>(async (resolve, reject) => {

                const validationResult = await v.callValidation();

                if (!validationResult) {

                    lastValidationFailed = true;

                    if (v.callMessage) {
                        const error = v.callMessage();

                        reject({ [this.currentValidation]: { [key]: error } });
                    }
                }

                resolve({ [this.currentValidation]: { [key]: this.data[key as keyof typeof this.data] } });
            });

        })

        return promises;
    }

    private async applyValidation(data: object): Promise<void> {
        this.errors[this.currentValidation] = {};
        this.data = data;

        const promises: Promise<object>[] = [];

        for (const key in this.customRules[this.currentValidation]) {

            const rules = [];

            if (typeof this.customRules[this.currentValidation][key] === 'string') {
                rules.push(...(this.customRules[this.currentValidation][key] as string).split('|'))
            } else if (Array.isArray(this.customRules[this.currentValidation][key])) {
                rules.push(...this.customRules[this.currentValidation][key])
            }

            promises.push(...this.mapRulesToPromises(rules, key));
        }

        let method: 'allSettled' | 'all' = 'allSettled';
        if (this.stopOnFirstError) {
            method = 'all';
        }

        await this.handlePromises(method, promises);


    }

    private async handlePromises(method: 'allSettled' | 'all', promises: Promise<object>[]): Promise<void> {

        try {

            const results = await Promise[method].call(Promise, promises);


            if (Array.isArray(results)) {

                const [resolved, rejected] = (results as Result[]).reduce<[Result[], Result[]]>((acc, result) => {

                    if (result.status === 'fulfilled') {
                        acc[0].push(result);
                    } else {
                        acc[1].push(result);
                    }

                    return acc;

                }, [[], []]);

                this.handleErrors(rejected);
                this.handleValidData(resolved);

            } else {
                throw new Error("Invalid promises array");
            }
        } catch (error: any) {
            for (const key in error[this.currentValidation]) {
                this.addError(key, error[this.currentValidation][key]);
            }
        }
    }

    private handleErrors(errors: Result[]): void {
        for (let i = 0; i < errors.length; i++) {
            const { reason: { [this.currentValidation]: currentValidation } } = errors[i];

            for (const key in currentValidation) {
                this.addError(key, currentValidation[key]);
            }
        }
    }

    private handleValidData(valid: Result[]): void {
        for (let i = 0; i < valid.length; i++) {
            const { value: { [this.currentValidation]: currentValidation } } = valid[i];

            for (const key in currentValidation) {
                this.addValidData(key, currentValidation[key]);
            }
        }
    }

    private async validateBody(data: object | undefined): Promise<void> {
        if (this.customRules.body && data) {
            this.currentValidation = 'body';
            await this.applyValidation(data);
        }
    }

    private async validateParams(data: object | undefined): Promise<void> {
        if (this.customRules.params && data) {
            this.currentValidation = 'params';
            await this.applyValidation(data);
        }
    }

    private async validateQuery(data: object | undefined): Promise<void> {
        if (this.customRules.query && data) {
            this.currentValidation = 'query';
            await this.applyValidation(data);
        }
    }

    public async validate(req: IValidationRequest, fail: (error: object, validated: object) => void): Promise<void> {
        this.fail = fail;

        this.beforeValidate();

        await this.validateBody(req.body);
        await this.validateParams(req.params);
        await this.validateQuery(req.query);

        this.afterValidate();

        this.fail(this.getValidationErrors(), this.getValidatedData());
    }
}

export default BaseValidator