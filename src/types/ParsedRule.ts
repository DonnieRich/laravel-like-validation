type ParsedCommonRule = {
    rule: string | null
    callMessage: (() => { name: string, message: string })
    callValidation: () => Promise<boolean>
    isCustomFunction: false
}

type ParsedFunctionRule = {
    rule: "function"
    callValidation: () => Promise<[boolean, { name: string, message: string }]>
    isCustomFunction: true
}

type InvalidRule = {
    rule: null
    callMessage: (() => { name: string, message: string })
}


export type ParsedRule = ParsedFunctionRule | ParsedCommonRule | InvalidRule;