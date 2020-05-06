import { Component, Inject, OnDestroy, OnInit, Optional, QueryList, ViewChild, ViewChildren, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, HostListener } from '@angular/core';
import { forkJoin, Observable, Subject, merge } from 'rxjs';
import { delay, filter, map, take } from 'rxjs/operators';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IFilterView } from '../../models/i-filter-view';
import { IFlowProcess } from '../../models/i-flow-process';
import { IQueryResult } from '../../models/i-query-result';
import { ITableColumn } from '../../models/i-table-column';
import { ResizableTable } from '../../models/resizable-table';
import { GridDataService } from '../../services/grid-data.service';
import { GridOpsatService } from '../../services/grid-opsat.service';
// import { FLOWPROCESSSTORE, IFlowProcessStore } from '../../tokens/flow-process-store';
import { SyncScrollPanelComponent } from '../sync-scroll-panel/sync-scroll-panel.component';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { topicFilter, dataMap } from '../../utils/grid-tool';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { DStoreOption } from '../../models/dstore';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { ColumnFilterPanelComponent } from '../column-filter-panel/column-filter-panel.component';
import { ToolTableComponent } from '../tool-table/tool-table.component';

@Component({
    selector: 'xcloud-grid-content',
    templateUrl: './grid-content.component.html',
    styleUrls: ['./grid-content.component.scss']
})
export class GridContentComponent implements OnInit, OnDestroy {

    public radioSelect: string;
    public enableColumnFrozen: boolean = true;
    public selectMode: string;
    public advancePanel: string;
    public datas: Array<any> = [];
    public unfrozenColumns: Array<ITableColumn> = [];
    public frozenColumns: Array<ITableColumn> = [];
    public unfrozenPanelScroll: Subject<void> = new Subject<void>();
    public enableRowOperation: boolean = false;
    public flowProcessKey: string;
    public showFilterView: boolean = false;
    public get showOperationTable(): boolean {
        // tslint:disable-next-line: no-redundant-boolean
        return this.enableRowOperation || this.flowProcessKey ? true : false;
    }
    @ViewChildren(ResizableTable) public tables: QueryList<ResizableTable>;
    @ViewChild(SyncScrollPanelComponent, { static: true })
    private syncScrollPanel: SyncScrollPanelComponent;
    @ViewChild('slaveScrollArea', { static: true, read: ViewContainerRef })
    public slaveScrollArea: ViewContainerRef;
    @ViewChild('filterPanelAnchor', { static: false, read: ViewContainerRef })
    private filterPanelAnchor: ViewContainerRef;
    private columns: Array<ITableColumn> = [];
    private refreshDataProcess: Subject<void> = new Subject<void>();
    private wheelingFn: any;
    public constructor(
        private opsat: GridOpsatService,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService,
        private cfr: ComponentFactoryResolver
        // @Optional() @Inject(FLOWPROCESSSTORE) private flowProcessSrv: IFlowProcessStore
    ) {
        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.EnableFilterView))
        //     .pipe(map(x => x.data))
        //     .subscribe(enable => this.enableFilterView = enable);

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.ProcessKey))
        //     .pipe(take(1))
        //     .pipe(map(x => x.data))
        //     .subscribe(key => this.flowProcessKey = key);
    }

    @HostListener('wheel', ['$event']) public onWheel(e: any): void {
        e.stopPropagation();
        if (!this.wheelingFn) {
            this.messageFlow.publish(MessageFlowEnum.EnableTableRowState, false);
        }
        clearTimeout(this.wheelingFn);
        this.wheelingFn = setTimeout(() => {
            this.wheelingFn = null;
            this.messageFlow.publish(MessageFlowEnum.EnableTableRowState, true);
        }, 250);
    }

    public ngOnDestroy(): void {
        // this.refreshDataProcess.complete();
        // this.refreshDataProcess.unsubscribe();
    }

    public ngOnInit(): void {
        this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.DStoreOption), dataMap, take(1))
            .subscribe((option: DStoreOption) => {
                // console.log(1, option);
                this.selectMode = option.selectMode;

                // if (this.selectMode) {
                //     let fac = this.cfr.resolveComponentFactory(ToolTableComponent);
                //     let com = this.slaveScrollArea.createComponent(fac);
                // }
                // console.log(111, this.slaveScrollArea);

            });

        this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ListData), dataMap)
            .subscribe((res: IQueryResult) => this.datas = res.items);

        this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition))
            .subscribe(() => {
                let cols = this.cache.getActiveFilterViewColumns();
                for (let idx: number = cols.length - 1; idx >= 0; idx--) {
                    let col: ITableColumn = cols[idx];
                    // tslint:disable-next-line: no-dynamic-delete
                    delete col['sorting_order'];
                }
                // if (this.cache.history.sorting.field) {
                //     let index: number = cols.findIndex(x => x.field === this.cache.history.sorting.field);
                //     if (index > -1) {
                //         cols[index]['sorting_order'] = this.cache.history.sorting.direction;
                //     }
                // }
                this.columns = cols;

                this.unfrozenColumns = this.columns.filter(x => !x['_frozen'] && !x['_invisibale']);
                this.frozenColumns = this.columns.filter(x => x['_frozen'] && !x['_invisibale']);
            });
        //     .pipe(delay(100))
        //     .subscribe((cols: Array<ITableColumn>) => {
        //         for (let idx: number = cols.length - 1; idx >= 0; idx--) {
        //             let col: ITableColumn = cols[idx];
        //             // tslint:disable-next-line: no-dynamic-delete
        //             delete col['sorting_order'];
        //         }
        //         // if (this.cache.history.sorting.field) {
        //         //     let index: number = cols.findIndex(x => x.field === this.cache.history.sorting.field);
        //         //     if (index > -1) {
        //         //         cols[index]['sorting_order'] = this.cache.history.sorting.direction;
        //         //     }
        //         // }
        //         this.columns = cols;

        //         this.unfrozenColumns = this.columns.filter(x => !x['_frozen'] && !x['_invisibale']);
        //         this.frozenColumns = this.columns.filter(x => x['_frozen'] && !x['_invisibale']);
        //     });

        this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.OpenFilterSettingPanel))
            .subscribe(() => {
                if (!this.filterPanelAnchor.length) {
                    const fac = this.cfr.resolveComponentFactory(ColumnFilterPanelComponent);
                    this.filterPanelAnchor.createComponent(fac);
                }
                this.showFilterView = !this.showFilterView;
            });

        const dataChangeObs: Observable<any> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ListData));
        const columnWidthChangeObs: Observable<any> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.ColumnWidthChange))
        merge(dataChangeObs, columnWidthChangeObs)
            .pipe(delay(800))
            .subscribe(() => this.syncScrollPanel.revirseScroll());
        // this.messageFlow.message
        // .pipe(filter(x => x.topic === MessageFlowEnum. || x.topic === GridTopicEnum.ColumnWidthChange))
        // .subscribe(() => {
        //     if (!this.filterPanelAnchor.length) {
        //         const fac = this.cfr.resolveComponentFactory(ColumnFilterPanelComponent);
        //         this.filterPanelAnchor.createComponent(fac);
        //     }
        //     this.showFilterView = !this.showFilterView;
        // });
        // this.refreshDataProcess.subscribe(() => {
        //     // console.log('flowProcessSrv', this.flowProcessSrv);
        //     if (!this.flowProcessSrv) { return; }

        //     forkJoin(this.datas.map(x => this.flowProcessSrv.getCurrentTask(this.flowProcessKey, x.id)))
        //         .subscribe((arr: Array<Array<IFlowProcess>>) => {

        //             for (let i: number = 0, len: number = arr.length; i < len; i++) {
        //                 this.datas[i]['_flowProcess'] = arr[i];
        //             }
        //             // console.log('process', arr[0]);
        //         });

        // });

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.EnableRowOperation))
        //     .pipe(take(1))
        //     .subscribe(() => this.enableRowOperation = true);

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.OpenAdvancePanel))
        //     .pipe(map(x => x.data))
        //     .subscribe((panel: string) => this.advancePanel = panel);

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.CloseAdvancePanel))
        //     .subscribe(() => this.advancePanel = null);

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.ColumnDefinition))
        //     .pipe(map(x => x.data))
        //     .pipe(delay(100))
        //     .subscribe((cols: Array<ITableColumn>) => {
        //         for (let idx: number = cols.length - 1; idx >= 0; idx--) {
        //             let col: ITableColumn = cols[idx];
        //             // tslint:disable-next-line: no-dynamic-delete
        //             delete col['sorting_order'];
        //         }
        //         if (this.cache.history.sorting.field) {
        //             let index: number = cols.findIndex(x => x.field === this.cache.history.sorting.field);
        //             if (index > -1) {
        //                 cols[index]['sorting_order'] = this.cache.history.sorting.direction;
        //             }
        //         }
        //         this.columns = cols;

        //         this.unfrozenColumns = this.columns.filter(x => !x['frozen'] && !x['invisibale']);
        //         this.frozenColumns = this.columns.filter(x => x['frozen'] && !x['invisibale']);
        //     });

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.ListData))
        //     .pipe(map(x => x.data))
        //     .pipe(delay(100))
        //     .subscribe((res: IQueryResult) => {
        //         this.datas = res.items;
        //         if (this.flowProcessKey) {
        //             this.refreshDataProcess.next();
        //         }
        //     });

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.EnableColumnFrozen))
        //     .pipe(take(1))
        //     .pipe(map(x => x.data))
        //     .subscribe(enable => this.enableColumnFrozen = enable);

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.RowSelectMode))
        //     .pipe(take(1))
        //     .pipe(map(x => x.data))
        //     .subscribe(mode => this.selectMode = mode);

        // this.opsat.message.pipe(filter(x => x.topic === GridTopicEnum.ListData || x.topic === GridTopicEnum.ColumnWidthChange), delay(800)).subscribe(() => {
        //     this.syncScrollPanel.revirseScroll();
        // });
    }

    public afterColumnResize(): void {
        const view: IFilterView = this.cache.getActiveFilterView();
        this.tables.forEach(it => {
            let obj: {} = it.calculateColumnWidth();

            let keys: Array<string> = Object.keys(obj);
            for (let field of keys) {
                let index: number = view.columns.findIndex(x => x.field === field);
                view.columns[index].width = obj[field];
            }
        });
        this.cache.setFilterView(view);
        this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view, fetchData: false });
    }

}
