export class IResponseResult<T> {
    success: boolean;
    error?: string;
    value?: T;
}