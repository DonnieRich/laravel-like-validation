export interface IParsedRule {
    rule: string | null
    callMessage: (() => { name: string, message: string }) | null
    callValidation: () => Promise<[boolean, { [k: string]: string }] | boolean>
    isCustomFunction: boolean
}