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
import { Observable } from 'rxjs';
import { IHistory } from '../../models/i-history';

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
        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);
        const historyObs: Observable<IHistory> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.History), dataMap);

        viewDefinitionObs
            .subscribe(views => {
                this.activeView = views.filter(x => x['_active'])[0].id;
                this.allViews = views.map(x => ({ value: x.id, label: x.name }));
            });

        historyObs.subscribe(history => {
            // console.log('history', history);
            this.keyword = history.keyword;
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
                        this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view });
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
        this.cache.setKeyword(this.keyword);
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public reset(): void {
        this.closeFilterPanel();
        this.cache.initializeHistory();
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public changeActiveView(): void {
        this.messageFlow.publish(MessageFlowEnum.CloseFilterSettingPanel);
        this.cache.setActiveViewId(this.activeView);
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }



}
