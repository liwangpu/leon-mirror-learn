import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { combineLatest, Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';
import { DStore } from '../../models/dstore';
import { IFilterView } from '../../models/i-filter-view';
import { IHistory } from '../../models/i-history';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataService } from '../../services/grid-data.service';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { topicFilter, dataMap } from '../../utils/grid-tool';
import { MessageFlowEnum } from '../../enums/message-flow.enum';

@Component({
    selector: 'xcloud-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        DialogService,
        GridDataService,
        GridOpsatService,
        GridDataFlowService,
        GridMessageFlowService
    ]
})
export class GridComponent implements OnInit {

    // private gridStartup: boolean = false;
    public constructor(
        private dstore: DStore,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService    ) {
        this.dstore.registryGridStartup(option => {

            this.dataFlow.publish(DataFlowTopicEnum.DStoreOption, option);

            this.messageFlow.publish(MessageFlowEnum.TableButtons, this.dstore.tableButtons);
            // 异步请求column,view
            from(this.dstore.getColumns()).subscribe(columns => this.dataFlow.publish(DataFlowTopicEnum._ColumnDefinition, columns));
            from(this.dstore.getFilterViews()).subscribe(views => this.dataFlow.publish(DataFlowTopicEnum._ViewDefinition, views));
            //
            this.dataFlow.publish(DataFlowTopicEnum._History, {});
        });

        // log整个表格通讯信息
        // this.opsat.message.subscribe(ms => console.log('message:', ms));
    }

    public refreshQuery(): void {
        // this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    public async ngOnInit(): Promise<void> {
        const colDefinitionfObs: Observable<any> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._ColumnDefinition), dataMap, take(1));
        const viewDefinitionObs: Observable<any> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._ViewDefinition), dataMap);
        const _historyObs: Observable<any> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._History), dataMap);
        const historyObs: Observable<IHistory> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.History), dataMap);
        const dataSelectedObs: Observable<Array<any>> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.RowSelected), dataMap);
        const fiterViewChangeObs: Observable<{ view: IFilterView, fetchData?: boolean }> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.FilterViewChange), dataMap);

        /**********************************************************************/
        combineLatest(colDefinitionfObs, viewDefinitionObs, _historyObs)
            .subscribe((resArr: [Array<ITableColumn>, Array<IFilterView>, IHistory]) => {
                const [cols, views, history] = resArr;
                // 1.默认视图可能是没有columns定义的,如果没有,需要把资源的columns赋值上去
                // 2.清除view active定义
                // 首先添加默认"全部"视图
                if (!views.some(x => x.id === '_ALL')) {
                    views.unshift({ id: '_ALL', name: '全部', columns: cols });
                }
                for (let idx: number = views.length - 1; idx >= 0; idx--) {
                    let view: IFilterView = views[idx];
                    view['_active'] = false;
                }
                let viewIndex: number = history.viewId ? views.findIndex(x => x.id === history.viewId) : 0;
                viewIndex = viewIndex || 0;
                views[viewIndex]['_active'] = true;
                // this.dataFlow.publish(DataFlowTopicEnum.ColumnDefinition, views[viewIndex].columns);
                this.dataFlow.publish(DataFlowTopicEnum.ViewDefinition, views);
                this.messageFlow.publish(MessageFlowEnum.History, history);
                // console.log(3, resArr);
            });

        dataSelectedObs
            .subscribe(datas => this.dstore.onDataSelected(datas));


        historyObs
            .subscribe(async () => {
                let datas = await this.dstore.onQuery();
                this.dataFlow.publish(DataFlowTopicEnum.ListData, datas);
                // console.log('history', history, datas);
            });

        fiterViewChangeObs
            .subscribe(async (obj: { view: IFilterView, fetchData?: boolean }) => {
                let { view, fetchData } = obj;
                // if (view.id === '_ALL') {
                //     this.dataFlow.publish(DataFlowTopicEnum.ViewDefinition, this.cache.getFilterViews());
                //     return;
                // }

                if (view.id) {
                    await this.dstore.onFilterViewUpdate(view);
                } else {
                    view = await this.dstore.onFilterViewCreate(view);
                    this.cache.setFilterView(view);
                }
                this.dataFlow.publish(DataFlowTopicEnum.ViewDefinition, this.cache.getFilterViews());

                if (fetchData) {
                    this.dataFlow.publish(DataFlowTopicEnum._ViewDefinition, this.cache.getFilterViews())
                }
            });
    }

    private static flatten(obj: any, nestedProperty: string, parentProperty: string, destArr: Array<any>, level?: number): void {
        if (!obj || !nestedProperty || !destArr) { return; }
        obj['_level'] = obj['@parent'] ? ((obj['@parent']['_level'] as number) + 1) : 1;
        destArr.push(obj);
        if (obj['_level'] < level && obj[nestedProperty] && obj[nestedProperty].length) {
            for (let child of obj[nestedProperty]) {
                if (child) {
                    child['_parent'] = obj[parentProperty];
                    child['_level'] = (obj['level'] as number) + 1;
                    child['@parent'] = obj;
                    GridComponent.flatten(child, nestedProperty, parentProperty, destArr, level);
                }
            }
            obj['_hasChildren'] = true;
        }
        // tslint:disable-next-line: no-dynamic-delete
        delete obj[nestedProperty];
    }

}
