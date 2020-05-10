import { IFilter } from './i-filter';
import { ITableColumn } from './i-table-column';

export const FILTERLOGICAND = 'and';
export const FILTERLOGICOR = 'or';

export interface IFilterView {
    id: string;
    name: string;
    filters?: Array<IFilter>;
    filterLogic?: string;
    columns?: Array<ITableColumn>;
}
