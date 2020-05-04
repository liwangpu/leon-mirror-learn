import { IFilter } from './i-filter';

export interface IHistory {
    viewId?: string;
    pagination?: { page?: number; limit?: number };
    sorting?: { field?: string; direction?: string };
    keyword?: string;
    dynamicFilters?: Array<IFilter>;
}
