// import { Injectable } from '@angular/core';
// import { EQ_OPERATOR } from '../consts/filter-operators';
// import { IFilter } from '../models/i-filter';
// import { IQueryParamTransformPolicy } from '../tokens/query-param-transform-policy';

// @Injectable()
// export class QueryParamTransformPolicyService implements IQueryParamTransformPolicy {
//     transformKeywordParam(keyword?: string): { [key: string]: any; } {
//         throw new Error("Method not implemented.");
//     }
//     transformFilterParam(filters: IFilter[]): { [key: string]: any; } {
//         throw new Error("Method not implemented.");
//     }
//     transformPaginationParam(pagination: { page?: number; limit?: number; }): { [key: string]: any; } {
//         throw new Error("Method not implemented.");
//     }
//     transformSortParam(sort: { field?: string; direction?: string; }): { [key: string]: any; } {
//         throw new Error("Method not implemented.");
//     }

//     public transform(pagination: { page?: number; limit?: number }, filters?: Array<IFilter>, sort?: { field?: string; direction?: string }, keyword?: string): any {

//         let param: {} = {};
//         param['_page'] = pagination.page;
//         param['_limit'] = pagination.limit;
//         if (keyword) {
//             param['q'] = keyword;
//         }

//         // 转换filter为查询参数,目前先转eq
//         // const operators = filterOperators;
//         if (filters && filters.length > 0) {
//             for (let idx: number = filters.length - 1; idx >= 0; idx--) {
//                 let it: IFilter = filters[idx];
//                 if (it.operator === EQ_OPERATOR) {
//                     param[it.field] = it.value;
//                 }
//             }
//         }

//         if (sort && sort.direction !== '') {
//             param['_sort'] = sort.field;
//             param['_order'] = sort.direction;
//         }

//         // console.log('query param transform', param);
//         return param;
//     }

// }
