import BaseRule from "../base/BaseRule.js"

export interface IRuleObject {
    body?: { [k: string]: string | (string | Function | BaseRule | [BaseRule, string, any])[] }
    params?: { [k: string]: string | (string | Function | BaseRule | [BaseRule, string, any])[] }
    query?: { [k: string]: string | (string | Function | BaseRule | [BaseRule, string, any])[] }
}