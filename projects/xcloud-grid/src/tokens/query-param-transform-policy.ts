import { InjectionToken } from '@angular/core';
import { EQ_OPERATOR } from '../consts/filter-operators';
import { IFilter } from '../models/i-filter';

/**
 * 把一个对象转换为filters,操作符只能是equal
 * @param obj obj
 */
export function TransformObjectToFilters(obj: any): Array<IFilter> {
    if (!obj) { return []; }
    if (typeof obj != 'object') { return []; }
    let filters: Array<IFilter> = [];
    let keys: Array<string> = Object.keys(obj);
    keys.forEach(k => {
        filters.push({ field: k, operator: EQ_OPERATOR, value: obj[k] });
    });
    return filters;
}

export interface IQueryParamTransformPolicy {
    transform(pagination: { page?: number; limit?: number }, filters?: Array<IFilter>, sort?: { field?: string; direction?: string }, keyword?: string): { [key: string]: any };
    transformKeywordParam(keyword?: string): { [key: string]: any };
    transformFilterParam(filters: Array<IFilter>): { [key: string]: any };
    transformPaginationParam(pagination: { page?: number; limit?: number }): { [key: string]: any };

    transformSortParam(sort: { field?: string; direction?: string }): { [key: string]: any };
}

export const QUERYPARAMTRANSFORMPOLICY: InjectionToken<IQueryParamTransformPolicy> = new InjectionToken<IQueryParamTransformPolicy>('grid query param transform policy');
