import { ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { delay, filter, map } from 'rxjs/operators';
import { SortTableColumnDirective } from '../directives/sort-table-column.directive';
import { GridTopicEnum } from '../enums/grid-topic.enum';
import { GridDataService } from '../services/grid-data.service';
import { GridOpsatService } from '../services/grid-opsat.service';
import { ISortEvent } from './i-sort-event';
import { ITableColumn } from './i-table-column';
import { Table } from './table';
import { GridMessageFlowService } from '../services/grid-message-flow.service';
import { topicFilter, dataMap } from '../utils/grid-tool';
import { MessageFlowEnum } from '../enums/message-flow.enum';

export abstract class ResizableTable extends Table implements OnInit {

    @Output()
    public readonly afterResize: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    public readonly radioSelectChange: EventEmitter<string> = new EventEmitter<string>();
    @Input()
    public selectMode: 'single' | 'multiple' = 'multiple';
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
    public enableRowState = true;
    protected abstract tableType: 'frozen' | 'unfrozen';
    public constructor(
        protected renderer2: Renderer2,
        protected cache: GridDataService,
        protected messageFlow: GridMessageFlowService,
        opsat: GridOpsatService
    ) {
        super(opsat);
    }
    public ngOnInit(): void {

        this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.EnableTableRowState), dataMap)
            .subscribe(enable => this.enableRowState = enable);


        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.NestedToggleField))
        //     .pipe(map(x => x.data))
        //     .subscribe(field => this.nestedToggleField = field);

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.ShowNestedDataLevel))
        //     .pipe(map(x => x.data))
        //     .subscribe(level => {
        //         this.nestedDataLevel = level;
        //         // console.log('level', level);
        //     });

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.ViewDefinition))
        //     .pipe(delay(80))
        //     .subscribe(() => {
        //         let cols: Array<ITableColumn> = this.cache.getActiveFilterViewColumns().filter(x => !x['_invisibale']
        //             && (this.tableType === 'unfrozen' ? !x['_frozen'] : x['_frozen']));
        //         let minWidth: number = 0;
        //         for (let col of cols) {
        //             minWidth += col.width ? col.width : 0;
        //         }

        //         if (this.nestedDataLevel > 1) {
        //             if (this.tableType === 'unfrozen') {
        //                 this.shownNestedData = !cols.some(x => x['_frozen']);
        //             } else if (this.tableType === 'frozen') {
        //                 this.shownNestedData = cols.some(x => x['_frozen']);
        //             } else {
        //                 //
        //             }
        //         }

        //         if (minWidth > 0) {
        //             this.renderer2.setStyle(this.table.nativeElement, 'width', `${minWidth}px`);
        //         } else {
        //             this.renderer2.removeStyle(this.table.nativeElement, 'width');
        //         }
        //     });

    }

    public onLinkFieldClick(field: string, data: any, link?: any): void {
        if (!link) { return; }
        // this.opsat.publish(GridTopicEnum.LinkFieldClick, { field, data });
    }

    public onRowClick(data: any): void {
        if (!this.selectMode) { return; }
        if (data['_level'] && data['_level'] > 1) { return; }

        this.radioSelectChange.emit(data['id']);

        if (this.selectMode === 'single') {
            this.opsat.publish(GridTopicEnum.RowSelected, [data]);
        } else {
            data['selected'] = !data['selected'];
            this.allRowSelected = !this.datas.some(x => !x['selected']);
            this.opsat.publish(GridTopicEnum.RowSelected, this.datas.filter(x => x['selected']));
        }
        // console.log('row select', data['id']);
        // console.log('row click', this.datas.filter(x => x['selected']));
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
