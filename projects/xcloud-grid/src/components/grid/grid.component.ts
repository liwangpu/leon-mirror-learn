import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import * as queryString from 'query-string';
import { combineLatest, Observable, of, from } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { DStore, DStoreOption } from '../../models/dstore';
import { IFilter } from '../../models/i-filter';
import { IFilterView } from '../../models/i-filter-view';
import { IHistory } from '../../models/i-history';
import { IQueryResult } from '../../models/i-query-result';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataService } from '../../services/grid-data.service';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { IQueryParamTransformPolicy, QUERYPARAMTRANSFORMPOLICY } from '../../tokens/query-param-transform-policy';
import { ArrayTool } from '../../utils/array-tool';
import { FilterUrlParser } from '../../utils/filter-url-parser';
import { ObjectTool } from '../../utils/object-tool';
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
export class GridComponent implements OnInit, AfterViewInit {

    // public flowProcessKey: string;
    private allFilterView: IFilterView;
    private enableUrlHistory: boolean = false;
    private nestedDataLevel: number = 0;
    private nestedToggleField: string;
    // private gridStartup: boolean = false;
    public constructor(
        @Inject(GRIDCONFIG) private gridConfig: IGridConfig,
        @Inject(QUERYPARAMTRANSFORMPOLICY) private queryTransformPolicy: IQueryParamTransformPolicy,
        private dstore: DStore,
        private opsat: GridOpsatService,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService,
        private router: Router,
        private acr: ActivatedRoute
    ) {
        this.dstore.registryGridStartup(option => {

            this.dataFlow.publish(DataFlowTopicEnum.DStoreOption, option);
            // 异步请求column,view
            from(this.dstore.getColumns()).subscribe(columns => this.dataFlow.publish(DataFlowTopicEnum._ColumnDefinition, columns));
            from(this.dstore.getFilterViews()).subscribe(views => this.dataFlow.publish(DataFlowTopicEnum._ViewDefinition, views));
            //
            this.dataFlow.publish(DataFlowTopicEnum._History, {});

            // if (!option) { option = {}; }

            // if (option.enableEdit) {
            //     this.opsat.publish(GridTopicEnum.EnableRowOperation);
            // }

            // if (option.selectMode) {
            //     this.opsat.publish(GridTopicEnum.RowSelectMode, option.selectMode);
            // }

            // if (option.showNestedDataLevel) {
            //     this.nestedDataLevel = Number(option.showNestedDataLevel);
            //     // console.log(1, this.nestedDataLevel);
            //     this.opsat.publish(GridTopicEnum.ShowNestedDataLevel, this.nestedDataLevel);
            // }

            // // if (option.processKey) {
            // //     // this.flowProcessKey = option.processKey;
            // //     this.opsat.publish(GridTopicEnum.ProcessKey, option.processKey);
            // // }

            // if (option.nestedToggleColumn) {
            //     this.nestedToggleField = option.nestedToggleColumn;
            //     this.opsat.publish(GridTopicEnum.NestedToggleField, this.nestedToggleField);
            // }

            // // tslint:disable-next-line: no-redundant-boolean
            // this.opsat.publish(GridTopicEnum.EnableFilterView, option.enableView);
            // // tslint:disable-next-line: no-redundant-boolean
            // this.opsat.publish(GridTopicEnum.EnableColumnFrozen, option.enableColumnFrozen);

            // if (option.enableUrlHistory) {
            //     // console.log('eee');
            //     this.enableUrlHistory = true;
            //     this.acr.queryParams.subscribe(prm => {
            //         let pageIndex: number = prm['page'] ? Number(prm['page']) : 1;
            //         let pageLimit: number = prm['limit'] ? Number(prm['limit']) : this.gridConfig.rowsPerPageOptions[0];
            //         let keyword: string = prm['keyword'];
            //         let viewId: string = prm['view'];
            //         let sortField: string = prm['sort'];
            //         let sortDirection: string = prm['order'];
            //         let filters: string = prm['filters'];

            //         let urlDyFilters: Array<IFilter> = FilterUrlParser.parser(filters);
            //         let dyFilters: Array<IFilter> = this.cache.history.dynamicFilters;
            //         // tslint:disable-next-line: prefer-conditional-expression
            //         if (dyFilters && dyFilters.length && urlDyFilters && urlDyFilters.length) {
            //             this.cache.history.dynamicFilters = dyFilters.concat(urlDyFilters);
            //         } else {
            //             this.cache.history.dynamicFilters = urlDyFilters;
            //         }

            //         this.cache.history.pagination.page = pageIndex;
            //         this.cache.history.pagination.limit = pageLimit;
            //         this.cache.history.sorting.field = sortField;
            //         this.cache.history.sorting.direction = sortDirection;
            //         this.cache.history.keyword = keyword;
            //         this.cache.history.viewId = viewId;
            //         this.opsat.publish(GridTopicEnum._History, this.cache.history);
            //     });
            // } else {
            //     this.opsat.publish(GridTopicEnum._History, this.cache.history);
            // }
            // this.gridStartup = true;
        });

        // log整个表格通讯信息
        // this.opsat.message.subscribe(ms => console.log('message:', ms));
    }

    public renderComponent(): void {
        // 获取表格列定义
        // this.dstore.getColumns()
        //     .pipe(take(1))
        //     .subscribe(cols => this.opsat.publish(GridTopicEnum._ColumnDefinition, cols));

        // // 获取视图定义
        // this.dstore.getFilterViews()
        //     .pipe(take(1))
        //     .subscribe(views => this.opsat.publish(GridTopicEnum._ViewDefinition, views));
    }

    public refreshQuery(): void {
        // this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    public async ngOnInit(): Promise<void> {
        const colDefinitionfObs: Observable<any> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._ColumnDefinition), dataMap, take(1));
        const viewDefinitionObs: Observable<any> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._ViewDefinition), dataMap);
        const historyObs: Observable<any> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._History), dataMap);
        combineLatest(colDefinitionfObs, viewDefinitionObs, historyObs)
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

        this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.History), dataMap)
            .subscribe(async (history: IHistory) => {
                let datas = await this.dstore.onQuery();
                this.dataFlow.publish(DataFlowTopicEnum.ListData, datas);
                // console.log('history', history, datas);
            });

        this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.FilterViewChange), dataMap)
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

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.History))
        //     .pipe(map(x => x.data))
        //     .pipe(switchMap((h: IHistory) => {
        //         // console.log('ui', h);
        //         let filters: Array<IFilter> = [];
        //         if (h.dynamicFilters && h.dynamicFilters.length > 0) {
        //             filters = filters.concat(h.dynamicFilters);
        //         }
        //         if (this.cache.activeFilterView.filters && this.cache.activeFilterView.filters.length > 0) {
        //             filters = filters.concat(this.cache.activeFilterView.filters);
        //         }

        //         // if (this.cache.history.dynamicFilters && this.cache.history.dynamicFilters.length > 0) {
        //         //     filters = filters.concat(this.cache.history.dynamicFilters);
        //         // }
        //         // if (this.cache.activeFilterView.filters && this.cache.activeFilterView.filters.length > 0) {
        //         //     filters = filters.concat(this.cache.activeFilterView.filters);
        //         // }

        //         // tslint:disable-next-line: no-inferred-empty-object-type
        //         const queryParam: any = this.queryTransformPolicy.transform(this.cache.history.pagination, filters, this.cache.history.sorting, this.cache.history.keyword);
        //         return this.dstore.onQuery(queryParam);
        //     }))
        //     .subscribe(res => {
        //         this.opsat.publish(GridTopicEnum._ListData, res);
        //     });

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum._ListData))
        //     .pipe(map(x => x.data))
        //     .pipe(map((res: IQueryResult) => {
        //         if (res.items && res.items.length) {
        //             res.items = GridComponent.flattenArray(res.items, 'children', 'id', this.nestedDataLevel);
        //         }
        //         return res;
        //     }))
        //     .subscribe(res => {
        //         // console.log('ListData:', res);
        //         this.opsat.publish(GridTopicEnum.ListData, res);
        //     });

        // // let lastQueryUrl: string = this.router.url;
        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum._HistoryChange))
        //     .pipe(map(x => x.data))
        //     .subscribe((h: IHistory) => {
        //         let urlArr: Array<string> = this.router.url.split('?');
        //         let urlObj: object = urlArr.length < 2 ? {} : queryString.parse(urlArr[1]);
        //         // tslint:disable-next-line: no-dynamic-delete
        //         delete urlObj['keyword'];
        //         // tslint:disable-next-line: no-dynamic-delete
        //         delete urlObj['sort'];
        //         // tslint:disable-next-line: no-dynamic-delete
        //         delete urlObj['order'];
        //         // tslint:disable-next-line: no-dynamic-delete
        //         delete urlObj['view'];

        //         urlObj['page'] = h.pagination.page;
        //         urlObj['limit'] = h.pagination.limit;

        //         if (h.viewId && h.viewId !== '_ALL') {
        //             urlObj['view'] = h.viewId;
        //         }
        //         if (h.keyword && h.keyword !== '') {
        //             urlObj['keyword'] = h.keyword;
        //         }

        //         if (h.sorting.field) {
        //             urlObj['sort'] = h.sorting.field;
        //             urlObj['order'] = h.sorting.direction;
        //         }

        //         // tslint:disable-next-line: no-dynamic-delete
        //         delete urlObj['filters'];
        //         if (h.dynamicFilters && h.dynamicFilters.length > 0) {
        //             let notBuildInFilters: Array<IFilter> = h.dynamicFilters.filter(x => !x.buildIn);
        //             if (notBuildInFilters && notBuildInFilters.length > 0) {
        //                 urlObj['filters'] = FilterUrlParser.stringify(notBuildInFilters);
        //             }
        //         }

        //         // if (this.enableUrlHistory) {
        //         //     let prmStr: string = queryString.stringify(urlObj);
        //         //     let nUrl: string = `${urlArr[0]}?${prmStr}`;
        //         //     if (nUrl !== lastQueryUrl) {
        //         //         lastQueryUrl = nUrl;
        //         //         // tslint:disable-next-line: no-floating-promises
        //         //         this.router.navigateByUrl(nUrl);
        //         //     } else {
        //         //         this.opsat.publish(GridTopicEnum._History, this.cache.history);
        //         //     }
        //         // } else {
        //         //     this.opsat.publish(GridTopicEnum._History, this.cache.history);
        //         // }

        //         this.opsat.publish(GridTopicEnum._History, this.cache.history);
        //     });

        // // 订阅视图创建/更新事件
        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.FilterViewCreateOrUpdate))
        //     .pipe(map(x => x.data))
        //     // .pipe(filter((x: IFilterView) => x.id !== '_ALL'))
        //     .pipe(switchMap(view => {
        //         // 全部视图在页面刷新前临时存储
        //         if (view.id === '_ALL') {
        //             this.allFilterView = view;
        //             return of(view);
        //         }

        //         if (view.id) {
        //             return this.dstore.onFilterViewUpdate(view).pipe(map(() => view));
        //         }
        //         return this.dstore.onFilterViewCreate(view).pipe(map(() => view));
        //     }))
        //     .pipe(switchMap(view => this.dstore.getFilterViews().pipe(map(views => [view, views]))))
        //     .subscribe((arr: [IFilterView, Array<IFilterView>]) => {
        //         let [view, views] = arr;
        //         this.cache.history.viewId = view.id;
        //         this.opsat.publish(GridTopicEnum._ViewDefinition, views);

        //         // this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
        //     });

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.LinkFieldClick))
        //     .pipe(map(x => x.data))
        //     .subscribe((item: { field: string; data: any }) => this.dstore.onLinkFieldClick(item.field, item.data));

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.RowSelected))
        //     .pipe(map(x => x.data))
        //     .subscribe(datas => this.dstore.onDataSelected(datas));

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.FlowProcessEdit))
        //     .pipe(map(x => x.data))
        //     .subscribe((data: { name: string; processKey: string; taskKey: string; dataId: string; formKey: string }) => this.dstore.onProcessEdit(data.name, data.processKey, data.taskKey, data.dataId, data.formKey));

        // this.renderComponent();
    }

    public ngAfterViewInit(): void {
        // // 结合列和视图定义,做初始输入流信息转换
        // this.transformViewDefinition();

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.RowOperating))
        //     .pipe(map(x => x.data))
        //     .subscribe((res: { operation: string; data: any }) => {
        //         if (res.operation === 'edit') {
        //             this.dstore.onDataEdit(res.data);
        //         }
        //     });
        // setTimeout(() => {
        //     this.opsat.publish(GridTopicEnum.OpenAdvancePanel, GridAdvanceViewEnum.Filter);
        // }, 800);
    }

    public setDynamicFilter(filters: Array<IFilter>): void {
        // this.cache.history.dynamicFilters = ArrayTool.deepCopy(filters);
        // if (!this.gridStartup) { return; }
        // this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

    private transformViewDefinition(): void {
        // const colDefinitionfObs: Observable<any> = this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum._ColumnDefinition))
        //     .pipe(map(x => x.data));
        // const viewDefinitionObs: Observable<any> = this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum._ViewDefinition))
        //     .pipe(map(x => x.data));
        // const historyObs: Observable<any> = this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum._History))
        //     .pipe(map(x => x.data));

        // // let lastHistory: any = null;
        // combineLatest(colDefinitionfObs, viewDefinitionObs, historyObs).subscribe((resArr: [Array<ITableColumn>, Array<IFilterView>, IHistory]) => {
        //     let cols: Array<ITableColumn> = ArrayTool.deepCopy(resArr[0]);
        //     let views: Array<IFilterView> = ArrayTool.deepCopy(resArr[1]);
        //     let history: IHistory = ObjectTool.deepCopy(resArr[2]);
        //     // 1.默认视图可能是没有columns定义的,如果没有,需要把资源的columns赋值上去
        //     // 2.清除view active定义
        //     // 首先添加默认"全部"视图
        //     views.unshift(this.allFilterView ? this.allFilterView : { id: '_ALL', name: '全部', columns: cols });

        //     for (let idx: number = views.length - 1; idx >= 0; idx--) {
        //         let view: IFilterView = views[idx];
        //         view.columns = view.columns ? view.columns : [];
        //         view['active'] = false;
        //         if (!view.columns || view.columns.length === 0) {
        //             let viewCols: Array<ITableColumn> = view.columns;
        //             for (let cdx: number = 0, len: number = cols.length; cdx < len; cdx++) {
        //                 let col: ITableColumn = cols[cdx];
        //                 let index: number = viewCols && viewCols.length > 0 ? viewCols.findIndex(x => x.field === col.field) : -1;
        //                 if (index > -1) {
        //                     col = viewCols[index];
        //                 }
        //                 view.columns.push(col);
        //             }
        //         }
        //     }

        //     let viewIndex: number = history.viewId ? views.findIndex(x => x.id === history.viewId) : 0;
        //     if (viewIndex === -1) {
        //         this.cache.history.viewId = undefined;
        //         history.viewId = undefined;
        //         viewIndex = 0;
        //     }

        //     views[viewIndex]['active'] = true;
        //     this.cache.filterViews = views;
        //     this.opsat.publish(GridTopicEnum.ColumnDefinition, views[viewIndex].columns);
        //     this.opsat.publish(GridTopicEnum.ViewDefinition, views);
        //     this.opsat.publish(GridTopicEnum.History, history);
        // });
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

    private static flattenArray(arr: Array<any>, nestedProperty: string, parentProperty: string, level?: number): Array<any> {
        let destArr: Array<any> = [];
        for (let it of arr) {
            GridComponent.flatten(it, nestedProperty, parentProperty, destArr, level);
        }
        for (let it of destArr) {
            it['_hidden'] = it['_level'] > 1;
            delete it['@parent'];
        }
        return destArr;
    }
}
