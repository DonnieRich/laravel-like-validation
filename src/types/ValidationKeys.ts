export type ErrorKeys = {
    body?: { [key: string]: object };
    params?: { [key: string]: object };
    query?: { [key: string]: object };
};

export type ErrorKeysType = keyof ErrorKeys;
export type ErrorPartialKeys = Partial<ErrorKeys>;

export type ValidatedKeys = {
    body?: { [key: string]: string | Array<any> };
    params?: { [key: string]: string | Array<any> };
    query?: { [key: string]: string | Array<any> };
};

export type ValidatedKeysType = keyof ValidatedKeys;
export type ValidatedPartialKeys = Partial<ValidatedKeys>;