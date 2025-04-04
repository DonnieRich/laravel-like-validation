export type Locals = {
    result: {
        errors: {
            body?: object
            params?: object
            query?: object
        };
        validated: {
            body?: object;
            params?: object;
            query?: object;
        };
    };
}