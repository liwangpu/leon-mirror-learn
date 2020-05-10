import { Component, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef, ComponentFactoryResolver, HostListener } from '@angular/core';
import { forkJoin, Observable, Subject, merge } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { IFilterView } from '../../models/i-filter-view';
import { IQueryResult } from '../../models/i-query-result';
import { ITableColumn } from '../../models/i-table-column';
import { ResizableTable } from '../../models/resizable-table';
import { GridDataService } from '../../services/grid-data.service';
import { SyncScrollPanelComponent } from '../sync-scroll-panel/sync-scroll-panel.component';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { topicFilter, dataMap } from '../../utils/grid-tool';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { DStoreOption } from '../../models/dstore';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { ColumnFilterPanelComponent } from '../column-filter-panel/column-filter-panel.component';
import { ITableButton } from '../../models/i-table-button';
import { ArrayTool } from '../../utils/array-tool';

@Component({
    selector: 'xcloud-grid-content',
    templateUrl: './grid-content.component.html',
    styleUrls: ['./grid-content.component.scss']
})
export class GridContentComponent implements OnInit {

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
    public showOperationTable: boolean = false;
    public syncMasterAreaConfirm = false;
    @ViewChildren(ResizableTable) public tables: QueryList<ResizableTable>;
    @ViewChild(SyncScrollPanelComponent, { static: true })
    private syncScrollPanel: SyncScrollPanelComponent;
    @ViewChild('filterPanelAnchor', { static: false, read: ViewContainerRef })
    private filterPanelAnchor: ViewContainerRef;
    private columns: Array<ITableColumn> = [];
    private wheelingFn: any;
    public constructor(
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService,
        private cfr: ComponentFactoryResolver
    ) {

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

    public ngOnInit(): void {
        const optionObs: Observable<DStoreOption> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.DStoreOption), dataMap);
        const dataObs: Observable<IQueryResult> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ListData), dataMap);
        const viewObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);
        const togglePanelObs: Observable<any> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.ToggleFilterSettingPanel));
        const closePanelObs: Observable<any> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.CloseFilterSettingPanel));
        const columnWidthChangeObs: Observable<any> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.ColumnWidthChange));
        const tableButtonObs: Observable<Array<ITableButton>> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.TableButtons), dataMap);

        tableButtonObs
            .pipe(take(1))
            .subscribe(buttons => this.showOperationTable = buttons && buttons.length ? true : false);

        optionObs
            .pipe(take(1))
            .subscribe(option => {
                this.selectMode = option.selectMode;
            });

        dataObs
            .subscribe((res: IQueryResult) => this.datas = res.items);

        viewObs
            .subscribe(() => {
                let cols = this.cache.getActiveFilterViewColumns();
                for (let idx: number = cols.length - 1; idx >= 0; idx--) {
                    let col: ITableColumn = cols[idx];
                    // tslint:disable-next-line: no-dynamic-delete
                    delete col['sorting_order'];
                }
                this.columns = cols;
                this.unfrozenColumns = this.columns.filter(x => !x['_frozen'] && !x['_invisibale']);
                //冻结列需要记住上次列顺序,补充式添加冻结列
                this.frozenColumns = ArrayTool.applyFilterKeepOriginArrayOrder(this.frozenColumns, this.columns, 'field', x => x['_frozen'] && !x['_invisibale']);
            });

        closePanelObs
            .subscribe(() => this.showFilterView = false);

        togglePanelObs
            .subscribe(() => {
                if (!this.filterPanelAnchor.length) {
                    const fac = this.cfr.resolveComponentFactory(ColumnFilterPanelComponent);
                    this.filterPanelAnchor.createComponent(fac);
                }
                this.showFilterView = !this.showFilterView;
            });

        merge(dataObs, columnWidthChangeObs)
            .pipe(delay(500))
            .subscribe(() => this.syncScrollPanel.revirseScroll());

        forkJoin(dataObs.pipe(take(1)), viewObs.pipe(take(1)), tableButtonObs.pipe(take(1)))
            .subscribe(() => {
                this.syncMasterAreaConfirm = true;
                // console.log('11', this.showOperationTable);
                // const facs: Array<ComponentFactory<any>> = [];

                // if (this.showOperationTable) {
                //     let ofac = this.cfr.resolveComponentFactory(OperationTableComponent);
                //     this.syncScrollPanel.masterPanelContainer.createComponent(ofac);
                //     //     facs.push(this.cfr.resolveComponentFactory(OperationTableComponent));
                // }
                // facs.push(this.cfr.resolveComponentFactory(UnFrozenTableComponent));
                // this.syncScrollPanel.createPanel(facs);
                // this.syncScrollPanel.revirseScroll();
            });

        setTimeout(() => {
            this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel);
        }, 200);
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
        this.cache.setFilterView(view, false);
    }

}
