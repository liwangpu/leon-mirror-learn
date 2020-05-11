import { IFilter } from './i-filter';

export interface IHistory {
    viewId?: string;
    pagination?: { page?: number; limit?: number };
    sorting?: { field?: string; direction?: string };
    keyword?: string;
    filters?: Array<IFilter>;
    filterLogic?: string;
    otherParams?: { [key: string]: any };
}
