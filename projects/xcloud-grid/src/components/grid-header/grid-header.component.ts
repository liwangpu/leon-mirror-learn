import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { IFilterView } from '../../models/i-filter-view';
import { GridDataService } from '../../services/grid-data.service';
import { ColumnVisualEditingPanelComponent } from '../column-visual-editing-panel/column-visual-editing-panel.component';
import { DynamicDialogRef, DynamicDialogService } from '@byzan/orion2';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { topicFilter, dataMap } from '../../utils/grid-tool';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { ITransferItem } from '../transfer/transfer.component';
import { ITableColumn } from '../../models/i-table-column';

@Component({
    selector: 'xcloud-grid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit {

    public enableFilterView: boolean = false;
    public enableReturn: boolean = false;
    public keyword: string;
    public allViews: Array<SelectItem> = [];
    public activeView: any;
    public advanceSettingMenu: Array<MenuItem>;
    public constructor(
        public dialogService: DynamicDialogService,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService
    ) {

    }

    public ngOnInit(): void {
        // 订阅视图数据信息
        this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap)
            .subscribe(views => {
                this.allViews = views.map(x => ({ id: x.id, label: x.name }))
            });
   
        this.advanceSettingMenu = [
            {
                label: '选择需要显示的列',
                command: () => {
                    let columns: Array<ITableColumn> = this.cache.getActiveFilterViewColumns();
                    const ref: DynamicDialogRef<ColumnVisualEditingPanelComponent> = this.dialogService.open(ColumnVisualEditingPanelComponent, {
                        header: '选择需要显示的字段',
                        width: '600px',
                        height: '500px',
                        data: { columns }
                    });
                    ref.afterClosed().pipe(filter(x => x)).subscribe((res: [Array<ITransferItem>, Array<ITransferItem>]) => {
                        let [targets, sources] = res;
                        let nColumns: Array<ITableColumn> = [];
                        sources.forEach(s => {
                            let col = columns.filter(x => x.field === s.value)[0];
                            col['_invisibale'] = false;
                            nColumns.push(col);
                        });
                        targets.forEach(s => {
                            let col = columns.filter(x => x.field === s.value)[0];
                            col['_invisibale'] = true;
                            nColumns.push(col);
                        });
                        let view: IFilterView = this.cache.getActiveFilterView();
                        view.columns = nColumns;
                        this.cache.setFilterView(view);
                    });
                }
            }
        ];



        // setTimeout(() => {
        //     let cols = this.cache.getActiveFilterViewColumns();
        // }, 500);
    }

    public toggleFilterPanel(): void {
        this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel);
    }

    public closeFilterPanel(): void {
        this.messageFlow.publish(MessageFlowEnum.CloseFilterSettingPanel);
    }

    public refresh(): void {
        this.closeFilterPanel();
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public search(): void {
        // this.cache.history.keyword = this.keyword;
        // this.cache.history.pagination.page = 1;
        // this.cache.history.pagination.limit = this.gridConfig.rowsPerPageOptions[0];
        // this.cache.history.sorting.field = undefined;
        // this.cache.history.sorting.direction = undefined;
        // this.cache.history.dynamicFilters = this.cache.history.dynamicFilters && this.cache.history.dynamicFilters.length ? this.cache.history.dynamicFilters.filter(x => x.buildIn) : undefined;
        // this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
        this.cache.setKeyword(this.keyword);
    }

    public reset(): void {
        this.closeFilterPanel();
        this.cache.initializeHistory();
        // this.keyword = undefined;
        // this.cache.history.keyword = undefined;
        // this.cache.history.pagination.page = 1;
        // this.cache.history.pagination.limit = this.gridConfig.rowsPerPageOptions[0];
        // this.cache.history.sorting.field = undefined;
        // this.cache.history.sorting.direction = undefined;
        // this.cache.history.dynamicFilters = this.cache.history.dynamicFilters && this.cache.history.dynamicFilters.length ? this.cache.history.dynamicFilters.filter(x => x.buildIn) : undefined;
        // this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

}
