export { };

declare global {
    namespace Express {
        interface Locals {
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
        interface Request {
            body?: object;
            params?: object;
            query?: object;
            locals: Locals;
        }

    }
}