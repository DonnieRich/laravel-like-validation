import BaseRule from "./BaseRule.js";
import type { IValidationSet } from "../contracts/IValidationSet.js";
import type { IRuleObject } from "../contracts/IRuleObject.js";
import type { Result } from "../types/Result.js";
import type BaseValidation from "./BaseValidation.js";
import type { ErrorKeysType, ErrorPartialKeys, ValidatedPartialKeys } from "../types/ValidationKeys.js";
import type { IValidator } from "../contracts/IValidator.js";
import type { ParsedRule } from "../types/ParsedRule.js";
import { type Request } from "../types/Request.js";
import type { OptionalFields } from "../types/OptionalFields.js";
import ParserFactory from "../factories/ParserFactory.js";

abstract class BaseValidator implements IValidator {
    protected validationSet!: IValidationSet;
    protected validation!: BaseValidation;

    private errors: ErrorPartialKeys = {
        body: {},
        params: {},
        query: {}
    };

    private validated: ValidatedPartialKeys = {
        body: {},
        params: {},
        query: {}
    };

    private optionalFields: OptionalFields = {
        body: {},
        params: {},
        query: {}
    }

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

    //TODO: add a list for all the fields that are validated but should not be passed in the request (like excluded, etc)

    private data: {} = {};

    private currentValidationKey: ErrorKeysType = 'body';

    protected stopOnFirstError: boolean = false;

    private reset(): void {
        this.data = {};
        this.customRules = {
            body: {},
            params: {},
            query: {}
        };
        this.errors = {
            body: {},
            params: {},
            query: {}
        };
        this.validated = {
            body: {},
            params: {},
            query: {}
        };
        this.customMessages = {};
        this.customAttributes = {};
        this.currentValidationKey = 'body';
    }

    protected beforeValidate(): void {

        this.reset();

        this.customRules = this.validation.rules();
        this.customMessages = this.validation.messages();
        this.customAttributes = this.validation.attributes();

    }

    protected afterValidate(): void {

    }

    protected getValidationErrors(): object {
        const errors: {
            body?: {},
            params?: {},
            query?: {}
        } = {};

        if (this.errors.body && Object.keys(this.errors.body).length > 0) {
            errors.body = { ...this.errors.body }
        }

        if (this.errors.params && Object.keys(this.errors.params).length > 0) {
            errors.params = { ...this.errors.params }
        }

        if (this.errors.query && Object.keys(this.errors.query).length > 0) {
            errors.query = { ...this.errors.query }
        }

        return errors;
    }

    protected getValidatedData(): object {
        const validated: {
            body?: {},
            params?: {},
            query?: {}
        } = {};

        if (this.validated.body && Object.keys(this.validated.body).length > 0) {
            validated.body = { ...this.validated.body }
        }

        if (this.validated.params && Object.keys(this.validated.params).length > 0) {
            validated.params = { ...this.validated.params }
        }

        if (this.validated.query && Object.keys(this.validated.query).length > 0) {
            validated.query = { ...this.validated.query }
        }

        return validated;
    }

    private addError(key: string, error: { name: string, message: string }): void {
        this.errors[this.currentValidationKey]![key] = { [error.name]: error.message, ...this.errors[this.currentValidationKey]![key] };
    }

    private addValidData(key: string, value: string | Array<any>): void {
        this.validated[this.currentValidationKey]![key] = value;
    }

    private getRule(rule: string | Function | BaseRule, key: string): ParsedRule {

        const parser = ParserFactory.make()
            .addCurrentValidationKey(this.currentValidationKey)
            .addData(this.data)
            .addValidationSet(this.validationSet)
            .addCustomMessages(this.customMessages)
            .addCustomAttributes(this.customAttributes)
            .addOptionalFields(this.optionalFields);

        const [parsed, optionalFields] = parser.parse(rule, key);

        this.optionalFields = optionalFields;


        return parsed;
    }

    private mapRulesToPromises(rules: (string | Function | BaseRule)[], key: string): Promise<object>[] {

        // let lastValidationFailed = false;

        const promises = rules.map(async rule => {

            const v = this.getRule(rule, key);

            return await new Promise<object>(async (resolve, reject) => {

                // If this field has an optional rule (e.g. nullable) and the value is
                // explicitly null, skip all other validations for this field.
                if (
                    this.optionalFields[this.currentValidationKey] &&
                    this.optionalFields[this.currentValidationKey][key] &&
                    this.data[key as keyof typeof this.data] === null
                ) {
                    resolve({ [this.currentValidationKey]: { [key]: this.data[key as keyof typeof this.data] } });
                    return;
                }

                if (v.rule === null) {

                    const error = v.callMessage();
                    reject({ [this.currentValidationKey]: { [key]: error } });

                } else if (v.isCustomFunction) {

                    const result = await v.callValidation();

                    if (typeof result === 'undefined' || !Array.isArray(result)) {

                        reject({ [this.currentValidationKey]: { [key]: { name: 'invalid-callback', message: 'The user provided callback didn\'t provided a valid return value. Array needed.' } } });

                    } else {

                        const [isValid, error] = result;

                        if (!isValid) {
                            reject({ [this.currentValidationKey]: { [key]: error } });
                        }

                    }


                } else {

                    const result = await v.callValidation();

                    if (!result) {

                        const error = v.callMessage();
                        reject({ [this.currentValidationKey]: { [key]: error } });

                    }
                }

                resolve({ [this.currentValidationKey]: { [key]: this.data[key as keyof typeof this.data] } });
            });

        })

        return promises;

    }

    private async applyValidation(data: object): Promise<void> {

        this.errors[this.currentValidationKey] = {};
        this.data = data;

        const promises: Promise<object>[] = [];

        for (const key in this.customRules[this.currentValidationKey]) {

            const rules = [];

            const currentValidation = this.customRules[this.currentValidationKey]![key];

            if (typeof currentValidation === 'string') {
                rules.push(...(currentValidation as string).split('|'))
            } else if (Array.isArray(currentValidation)) {
                rules.push(...currentValidation)
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

    }

    private handleErrors(errors: Result[]): void {
        for (let i = 0; i < errors.length; i++) {
            const { reason: { [this.currentValidationKey]: currentValidation } } = errors[i];

            for (const key in currentValidation) {
                this.addError(key, currentValidation[key]);
            }
        }
    }

    private handleValidData(valid: Result[]): void {
        for (let i = 0; i < valid.length; i++) {
            const { value: { [this.currentValidationKey]: currentValidation } } = valid[i];

            for (const key in currentValidation) {
                this.addValidData(key, currentValidation[key]);
            }
        }
    }

    protected async validateBody(data: object | undefined): Promise<void> {
        if (this.customRules.body && data) {
            this.currentValidationKey = 'body';
            await this.applyValidation(data);
        }
    }

    protected async validateParams(data: object | undefined): Promise<void> {
        if (this.customRules.params && data) {
            this.currentValidationKey = 'params';
            await this.applyValidation(data);
        }
    }

    protected async validateQuery(data: object | undefined): Promise<void> {
        if (this.customRules.query && data) {
            this.currentValidationKey = 'query';
            await this.applyValidation(data);
        }
    }

    abstract setValidation(validation: BaseValidation): void;
    abstract setValidationSet(validationSet: IValidationSet): void;
    abstract validate(req: Request): Promise<[object, object]>;

}

export default BaseValidator