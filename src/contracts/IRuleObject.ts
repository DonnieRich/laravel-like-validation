import BaseRule from "../base/BaseRule.js"
import type { ErrorKeysType } from "../types/ValidationKeys.js"

export interface IRuleObject {
    body?: { [k: string]: string | (string | Function | BaseRule)[] }
    params?: { [k: string]: string | (string | Function | BaseRule)[] }
    query?: { [k: string]: string | (string | Function | BaseRule)[] }
}