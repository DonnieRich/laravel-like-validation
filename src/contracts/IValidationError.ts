export interface IValidationError extends Error {
    status: number;
    errors: object | undefined;
}