import type { RulesSet } from "../types/RulesSet";

export interface IValidationSet {
    getRules: () => RulesSet;
    matchRule: (r: string) => string[];
}