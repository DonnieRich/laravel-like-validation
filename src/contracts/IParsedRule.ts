export interface IParsedRule {
    rule: string | null
    callValidation: () => boolean
    callMessage: (() => { name: string, message: string }) | null
}