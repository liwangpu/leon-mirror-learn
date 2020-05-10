import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { filter, map, take } from 'rxjs/operators';
import { ColumnTypeEnum } from '../../enums/column-type-enum.enum';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IFilter } from '../../models/i-filter';
import { IFilterView } from '../../models/i-filter-view';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataService } from '../../services/grid-data.service';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { ArrayTool } from '../../utils/array-tool';
import { ObjectTool } from '../../utils/object-tool';
import { ColumnFilterViewEditPanelComponent } from '../column-filter-view-edit-panel/column-filter-view-edit-panel.component';
import { FilterItemBoxComponent } from '../filter-item-box/filter-item-box.component';
import { DialogService } from 'primeng/dynamicdialog';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { MessageFlowEnum } from '../../enums/message-flow.enum';

@Component({
    selector: 'xcloud-grid-column-filter-panel',
    templateUrl: './column-filter-panel.component.html',
    styleUrls: ['./column-filter-panel.component.scss']
})
export class ColumnFilterPanelComponent implements OnInit {

    @ViewChild('filterItemsContainer', { static: true, read: ViewContainerRef })
    public filterItemsContainer: ViewContainerRef;
    public enableFilterView: boolean = false;
    public filterView: IFilterView;
    public advanceMenuItems: Array<MenuItem>;
    public filterItemBoxs: Array<FilterItemBoxComponent> = [];
    public logicalOperations: Array<SelectItem>;
    public logicalOperation: string = '@and';
    public constructor(
        private cfr: ComponentFactoryResolver,
        private cache: GridDataService,
        private messageFlow: GridMessageFlowService,
        private dialogService: DialogService
    ) {
        this.logicalOperations = [
            {
                label: '满足以下所有条件',
                value: '@and'
            },
            {
                label: '满足以下任意条件',
                value: '@or'
            }
        ];
    }

    public ngOnInit(): void {
        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.ViewDefinition))
        //     .pipe(map(x => x.data))
        //     .subscribe(() => {
        //         // this.filterView = ObjectTool.deepCopy(this.cache.activeFilterView);
        //         // this.renderFilterPanel();
        //     });

        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.EnableFilterView))
        //     .pipe(map(x => x.data))
        //     .subscribe(enable => this.enableFilterView = enable);

        // this.advanceMenuItems = [
        //     {
        //         label: '另存为', command: () => {
        //             this.saveAs();
        //         }
        //     }
        // ];
    }

    public renderFilterPanel(): void {
        this.filterItemsContainer.clear();
        this.filterItemBoxs = [];
        if (this.filterView.filters && this.filterView.filters.length > 0) {
            for (let it of this.filterView.filters) {
                this.addFilterItem(it.field, it.operator, it.value);
            }
        }
    }

    public addFilterItem(field?: string, operator?: string, value?: string): void {
        let factory: ComponentFactory<FilterItemBoxComponent> = this.cfr.resolveComponentFactory(FilterItemBoxComponent);
        let com: ComponentRef<FilterItemBoxComponent> = this.filterItemsContainer.createComponent(factory);
        com.instance.id = `${Date.now()}-${field}`;
        com.instance.field = field;
        com.instance.operator = operator;
        com.instance.value = value;
        com.instance.generateDisplayMessage();
        com.instance.delete.pipe(take(1)).subscribe(id => {
            const i: number = this.filterItemBoxs.findIndex(x => x.id === id);
            if (i === -1) { return; }
            ArrayTool.remove(this.filterItemBoxs, it => it.id === id);
            this.filterItemsContainer.remove(i);
        });
        com.instance.editItem();
        this.filterItemBoxs.push(com.instance);
    }

    public clearFilterItems(): void {
        this.filterItemsContainer.clear();
        this.filterItemBoxs = [];
    }

    public save(): void {
        // let view: IFilterView = ObjectTool.deepCopy(this.filterView);
        // if (view.id === '_ALL') {
        //     this.saveAs(view);
        //     return;
        // }

        // view.filters = this.filterItemBoxs.filter(x => x.field).map(x =>
        //     ({
        //         field: x.field,
        //         operator: x.operator,
        //         value: x.value
        //     }));
        // this.transformFilterValueType(view);

        // this.dialogService.open(ColumnFilterViewEditPanelComponent, {
        //     header: '保存新列表视图',
        //     width: '450px',
        //     height: '300px',
        //     data: view
        // });

        // ref.onClose
        //     .pipe(take(1))
        //     .pipe(filter(updateView => updateView))
        //     .subscribe(() => {
        //     });
    }

    public saveAs(v?: IFilterView): void {
        // let view: IFilterView = v ? v : ObjectTool.deepCopy(this.filterView);
        // view.id = undefined;
        // view.name = undefined;
        // view.filters = this.filterItemBoxs.filter(x => x.field).map(x =>
        //     ({
        //         field: x.field,
        //         operator: x.operator,
        //         value: x.value
        //     }));
        // this.transformFilterValueType(view);
        // this.dialogService.open(ColumnFilterViewEditPanelComponent, {
        //     header: '保存新列表视图',
        //     width: '450px',
        //     height: '300px',
        //     data: view
        // });

        // ref.onClose
        //     .pipe(take(1))
        //     .pipe(filter(updateView => updateView))
        //     .subscribe(() => {
        //     });
    }

    public query(): void {
        // let view: IFilterView = ObjectTool.deepCopy(this.filterView);
        // view.filters = this.filterItemBoxs.filter(x => x.field).map(x =>
        //     ({
        //         field: x.field,
        //         operator: x.operator,
        //         value: x.value
        //     }));
        // this.transformFilterValueType(view);
        // this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, view);
        this.messageFlow.publish(MessageFlowEnum.CloseFilterSettingPanel);
    }

    private transformFilterValueType(view: IFilterView): void {
        // if (!view.filters && view.filters.length < 1) {
        //     return;
        // }
        // const cols: Array<ITableColumn> = this.cache.columns;
        // for (let idx: number = view.filters.length - 1; idx >= 0; idx--) {
        //     // tslint:disable-next-line: no-shadowed-variable
        //     let filter: IFilter = view.filters[idx];
        //     let col: ITableColumn = cols.filter(x => x.field === filter.field)[0];
        //     if (col) {
        //         // tslint:disable-next-line: prefer-switch
        //         if (col.fieldType === ColumnTypeEnum.Number) {
        //             filter.value = Number(filter.value);
        //         } else if (col.fieldType === ColumnTypeEnum.Select) {
        //             if (this.cache.fieldInfos && this.cache.fieldInfos[col.field]) {
        //                 let t: string = typeof (this.cache.fieldInfos[col.field][0].value);
        //                 // tslint:disable-next-line: prefer-conditional-expression
        //                 if (t === 'number') {
        //                     filter.value = Number(filter.value);
        //                 } else {
        //                     filter.value = `${filter.value}`;
        //                 }
        //             } else {
        //                 filter.value = `${filter.value}`;
        //             }
        //         } else {
        //             filter.value = `${filter.value}`;
        //         }
        //     }
        // }
    }

}
