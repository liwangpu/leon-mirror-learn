import { ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { SortTableColumnDirective } from '../directives/sort-table-column.directive';
import { GridDataService } from '../services/grid-data.service';
import { ISortEvent } from './i-sort-event';
import { ITableColumn } from './i-table-column';
import { Table } from './table';
import { GridMessageFlowService } from '../services/grid-message-flow.service';
import { topicFilter, dataMap } from '../utils/grid-tool';
import { MessageFlowEnum } from '../enums/message-flow.enum';
import { Observable } from 'rxjs';
import { DataFlowTopicEnum } from '../enums/data-flow-topic.enum';
import { GridDataFlowService } from '../services/grid-data-flow.service';
import { IFilterView } from './i-filter-view';
import { take } from 'rxjs/operators';

export abstract class ResizableTable extends Table implements OnInit {

    @Output()
    public readonly afterResize: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    public readonly radioSelectChange: EventEmitter<string> = new EventEmitter<string>();
    @Input()
    public snapline: Element;
    @ViewChildren(SortTableColumnDirective)
    public sortColumns: QueryList<SortTableColumnDirective>;
    @ViewChildren('headerCell')
    public headerCells: QueryList<ElementRef>;
    public nestedDataLevel: number = 0;
    public nestedToggleField: string;
    public shownNestedData: boolean = false;
    public allRowSelected: boolean = false;
    protected abstract tableType: 'frozen' | 'unfrozen';
    public constructor(
        protected renderer2: Renderer2,
        protected cache: GridDataService,
        protected dataFlow: GridDataFlowService,
        protected messageFlow: GridMessageFlowService
    ) {
        super(messageFlow);
    }
    public ngOnInit(): void {
        super.ngOnInit();

        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);

        viewDefinitionObs.pipe(take(1)).subscribe(views => {
            let view = views.filter(x => x['_active'])[0];
            let cols: Array<ITableColumn> = view.columns.filter(x => !x['_invisibale']
                && (this.tableType === 'unfrozen' ? !x['_frozen'] : x['_frozen']));
            let minWidth: number = 0;
            for (let col of cols) {
                minWidth += col.width ? col.width : 0;
            }

            if (this.nestedDataLevel > 1) {
                if (this.tableType === 'unfrozen') {
                    this.shownNestedData = !cols.some(x => x['_frozen']);
                } else if (this.tableType === 'frozen') {
                    this.shownNestedData = cols.some(x => x['_frozen']);
                } else {
                    //
                }
            }

            if (minWidth > 0) {
                this.renderer2.setStyle(this.table.nativeElement, 'width', `${minWidth}px`);
            } else {
                this.renderer2.removeStyle(this.table.nativeElement, 'width');
            }
        });
    }

    public onLinkFieldClick(field: string, data: any, link?: any): void {
        if (!link) { return; }
        // this.opsat.publish(GridTopicEnum.LinkFieldClick, { field, data });
    }

    public afterColumnResize(): void {
        this.afterResize.next();
        this.messageFlow.publish(MessageFlowEnum.ColumnWidthChange);
    }

    public calculateColumnWidth(): { [key: string]: number } {
        let obj: any = {};
        let index: number = 0;
        this.headerCells.forEach(it => {
            const rect: any = it.nativeElement.getBoundingClientRect();
            obj[this.columns[index].field] = rect.width;
            index++;
        });
        return obj;
    }

    public onSort(sort: ISortEvent): void {
        // // 先清除其他排序列
        this.clearSort(sort.field);
        let field: string = null;
        let direction: string = null;
        if (sort.direction) {
            field = sort.field;
            direction = sort.direction;
        }
        this.cache.setSorting(field, direction);
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public toggleNestedData(item: any, e: any): void {
        e.stopPropagation();
        // tslint:disable-next-line: no-redundant-boolean
        const hideNestedData: boolean = item['_hideNestedData'] ? true : false;

        // 递归折叠
        if (hideNestedData) {
            this.collapseReferenceNestedData(item);
        } else {
            // 显示第一级
            this.datas.forEach(it => {
                if (it['_parent'] === item['id']) {
                    it['_hidden'] = false;
                }
            });
        }
        item['_hideNestedData'] = !hideNestedData;
    }

    private collapseReferenceNestedData(item: any): void {
        item['_hideNestedData'] = true;
        let children: Array<any> = this.datas.filter(it => it['_parent'] === item['id']);
        if (!children.length) { return; }

        for (let it of children) {
            it['_hidden'] = true;
            item['_hideNestedData'] = false;
            let subChildren: Array<any> = this.datas.filter(x => x['_parent'] === item['id']);
            if (subChildren.length) {
                subChildren.forEach(x => this.collapseReferenceNestedData(x));
            }
        }
    }

    private clearSort(excludeField?: string): void {
        if (this.sortColumns.length > 0) {
            this.sortColumns.forEach(it => {
                if (!it.columnField) { return; }

                if (!(excludeField && it.columnField === excludeField)) {
                    it.clearSort();
                }
            });
        }
    }
}
