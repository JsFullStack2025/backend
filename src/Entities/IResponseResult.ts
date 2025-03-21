export interface IResponseResult<T> {
    success: boolean;
    error: string;
    value: T;
}