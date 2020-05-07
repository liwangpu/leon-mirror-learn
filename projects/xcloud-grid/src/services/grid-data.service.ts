import { Injectable, Inject } from '@angular/core';
import { IFilterView } from '../models/i-filter-view';
import { IHistory } from '../models/i-history';
import { ISelectOption } from '../models/i-select-option';
import { ITableColumn } from '../models/i-table-column';
import { GridMessageFlowService } from './grid-message-flow.service';
import { GridDataFlowService } from './grid-data-flow.service';
import { DataFlowTopicEnum } from '../enums/data-flow-topic.enum';
import { topicFilter, dataMap } from '../utils/grid-tool';
import { MessageFlowEnum } from '../enums/message-flow.enum';
import { GRIDCONFIG, IGridConfig } from '../tokens/grid-config';
import { ObjectTool } from '../utils/object-tool';

@Injectable()
export class GridDataService {

    public fieldInfos: { [key: string]: Array<ISelectOption> };
    private history: IHistory = { pagination: {}, sorting: {}, keyword: null };
    private filterViews: Array<IFilterView>;
    public constructor(
        @Inject(GRIDCONFIG) private gridConfig: IGridConfig,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService
    ) {
        this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap)
            .subscribe((views: Array<IFilterView>) => {
                // console.log('vvv', views);
                this.filterViews = views;
            });
    }

    public getHistory(): IHistory {
        return ObjectTool.deepCopy(this.history);
    }

    public getActiveFilterViewColumns(): Array<ITableColumn> {
        const view = this._getActiveFilterView();
        return ObjectTool.deepCopy(view.columns);
    }

    public getActiveFilterView(): IFilterView {
        return ObjectTool.deepCopy(this._getActiveFilterView());
    }

    public getFilterViews(): Array<IFilterView> {
        return ObjectTool.deepCopy(this.filterViews);
    }

    public setFilterView(view: IFilterView): void {
        let v: IFilterView = ObjectTool.deepCopy(view);
        let index = this.filterViews.findIndex(x => x.id === v.id);
        if (index > -1) {
            this.filterViews[index] = v;
            return;
        }
        this.filterViews.push(v);
    }

    public setKeyword(keyword?: string): void {
        this._initializeHistory();
        this.history.keyword = keyword;
        this.dataFlow.publish(DataFlowTopicEnum._History, this.history);
    }

    public freezeColumn(field: string): void {
        let view = this._getActiveFilterView();
        const cols: Array<ITableColumn> = view.columns;
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field == field) {
                let it: ITableColumn = cols[i];
                it['_frozen'] = true;
                break;
            }
        }
        // console.log('v', view);
        this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view, fetchData: false });
    }

    public unfreezenColumn(field: string): void {
        let view = this._getActiveFilterView();
        const cols: Array<ITableColumn> = view.columns;
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field == field) {
                let it: ITableColumn = cols[i];
                it['_frozen'] = false;
                break;
            }
        }
        // console.log('v', view);
        this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view, fetchData: false });
    }

    public setPagination(page?: number, limit?: number): void {
        this.history.pagination.page = page;
        this.history.pagination.limit = limit;
        this.dataFlow.publish(DataFlowTopicEnum._History, this.history);
    }

    public setSorting(field: string, direction?: string): void {
        this.history.sorting.field = field;
        this.history.sorting.direction = direction;
        this.dataFlow.publish(DataFlowTopicEnum._History, this.history);
    }

    public initializeHistory(): void {
        this._initializeHistory();
        this.dataFlow.publish(DataFlowTopicEnum._History, this.history);
    }

    private _initializeHistory(): void {
        this.history.keyword = null;
        this.history.pagination.page = 1;
        this.history.pagination.limit = this.gridConfig.rowsPerPageOptions[0];
        this.history.sorting.field = undefined;
        this.history.sorting.direction = undefined;
    }

    private _getActiveFilterView(): IFilterView {
        return this.filterViews.filter(x => x['_active'])[0];
    }
}
