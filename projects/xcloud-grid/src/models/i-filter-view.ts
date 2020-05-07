import { IFilter } from './i-filter';
import { ITableColumn } from './i-table-column';

export interface IFilterView {
    id: string;
    name: string;
    filters?: Array<IFilter>;
    columns?: Array<ITableColumn>;
}
