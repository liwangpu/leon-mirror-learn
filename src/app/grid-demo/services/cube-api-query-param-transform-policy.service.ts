import { Injectable } from '@angular/core';
import { IQueryParamTransformPolicy, IFilter } from 'xcloud-grid';

@Injectable()
export class CubeApiQueryParamTransformPolicyService implements IQueryParamTransformPolicy {

    public transformKeywordParam(keyword?: string): { [key: string]: any } {
        let param: any = {};
        if (keyword) {
            param['keyword'] = keyword;
        }
        return param;
    }

    public transformPaginationParam(pagination: {
        page?: number; limit?: number; // 转换filter为查询参数
    }): { [key: string]: any } {
        let param: any = {};
        let pageIndex: number = pagination && pagination.page ? pagination.page : 1;
        let pageSize: number = pagination && pagination.limit ? pagination.limit : 20;

        param['pagination'] = `skip=${pageSize * (pageIndex - 1)}&limit=${pageSize}`;
        return param;
    }

    public transformSortParam(sort: { field?: string; direction?: string }): { [key: string]: any } {
        let param: any = {};
        if (sort && sort.field && sort.direction !== '') {
            let _sort: any = {};
            _sort[`data.${sort.field}`] = sort.direction === 'asc' ? 1 : -1;
            param['sort'] = _sort;
        }
        return param;
    }

    public transformFilterParam(filters: Array<IFilter>): { [key: string]: any } {
        // console.log('filter transform', filters);
        let param: any = {};


        return param;
    }

    public transform(pagination: { page?: number; limit?: number }, filters?: Array<IFilter>, sort?: { field?: string; direction?: string }, keyword?: string): {} {
        let keywordParam: any = this.transformKeywordParam(keyword);
        let paginationParam: any = this.transformPaginationParam(pagination);
        let sortParam: any = this.transformSortParam(sort);
        let filterParam: any = this.transformFilterParam(filters);
        // console.log('sort', keywordParam);
        return { ...keywordParam, ...paginationParam, ...sortParam, ...filterParam };
    }
}
