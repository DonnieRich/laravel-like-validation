import type { Locals } from './Locals.js';
export type Request = {
    body?: object;
    params?: object;
    query?: object;
    locals: Locals;
}