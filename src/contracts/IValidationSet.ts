import type { RulesSet } from "../types/RulesSet.js";

export interface IValidationSet {
    getRules: () => RulesSet;
    matchRule: (r: string) => string[];
}