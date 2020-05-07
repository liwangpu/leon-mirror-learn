export interface IQueryResult<T = any> {
    count?: number;
    offset?: number;
    limit?: number;
    items?: Array<T>;
}
