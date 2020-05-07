import { Observable } from 'rxjs';
import { IFilterView } from './i-filter-view';
import { IQueryResult } from './i-query-result';
import { ITableColumn } from './i-table-column';
import { ITableButton } from './i-table-button';

export interface DStoreOption {
    selectMode?: 'single' | 'multiple';
    enableView?: boolean;
    enableColumnFrozen?: boolean;
    enableEdit?: boolean;
    showNestedDataLevel?: number;
    nestedToggleColumn?: string;
}

export abstract class DStore {
    private gridStartupFn: (option?: DStoreOption) => void;
    public abstract tableButtons: Array<ITableButton>;
    public abstract getColumns(): Promise<Array<ITableColumn>>;
    public abstract onQuery(queryParam?: { [key: string]: any }): Promise<IQueryResult>;
    public abstract getFilterViews(): Promise<Array<IFilterView>>;
    public abstract onFilterViewCreate(view: IFilterView): Promise<IFilterView>;
    public abstract onFilterViewUpdate(view: IFilterView): Promise<void>;
    public async gridStartup(option?: DStoreOption): Promise<void> {
        option = option || {};

        this.gridStartupFn(option);
    }
    public registryGridStartup(fn: (option: DStoreOption) => void): void {
        this.gridStartupFn = fn;
    }
}
