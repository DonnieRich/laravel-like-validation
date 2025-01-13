export interface IParsedRule {
    rule: string | null
    callValidation: () => Promise<boolean>
    callMessage: (() => { name: string, message: string }) | null
}