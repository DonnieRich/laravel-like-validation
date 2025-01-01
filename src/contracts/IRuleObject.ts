import BaseRule from "../base/BaseRule.js"

export interface IRuleObject {
    body: { [k: string]: string | [string, Function, BaseRule] }
    params: { [k: string]: string | [string, Function, BaseRule] }
    query: { [k: string]: string | [string, Function, BaseRule] }
}