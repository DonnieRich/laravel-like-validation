import BaseRule from "../base/BaseRule.js"
import type { ValidationKeys } from "../types/ValidationKeys.js"

type StringValidationKeys = Extract<ValidationKeys, string>;

export interface IRuleObject extends Record<StringValidationKeys, { [k: string]: string | [string, Function, BaseRule] }> {
    body?: { [k: string]: string | [string, Function, BaseRule] }
    params?: { [k: string]: string | [string, Function, BaseRule] }
    query?: { [k: string]: string | [string, Function, BaseRule] }
}