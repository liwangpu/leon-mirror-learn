import { Component, EventEmitter, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { filter, take } from 'rxjs/operators';
import { FILTEROPERATORS } from '../../consts/filter-operators';
import { ISelectOption } from '../../models/i-select-option';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataService } from '../../services/grid-data.service';
import { FilterItemSettingPanelComponent } from '../filter-item-setting-panel/filter-item-setting-panel.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'xcloud-grid-filter-item-box',
    templateUrl: './filter-item-box.component.html',
    styleUrls: ['./filter-item-box.component.scss'],
    providers: [
        DialogService
    ]
})
export class FilterItemBoxComponent {

    public id: string;
    public field: string;
    public fieldName: string;
    public operator: string;
    public operatorName: string;
    public text: string;
    public value: any;
    @Output() public readonly delete: EventEmitter<string> = new EventEmitter<string>();
    public constructor(
        public dialogService: DialogService,
        private cache: GridDataService,
    ) { }
    public editItem(): void {
        const ref: DynamicDialogRef = this.dialogService.open(FilterItemSettingPanelComponent, {
            header: '筛选器设置',
            width: '400px',
            height: '420px',
            data: this.field ? { field: this.field, operator: this.operator, value: this.value } : null
        });

        ref.onClose.pipe(take(1), filter(x => x)).subscribe((res: { field: string; operator: string; value: string }) => {
            this.field = res.field;
            this.operator = res.operator;
            this.value = res.value;
            this.generateDisplayMessage();
        });
    }

    public deleteItem(): void {
        this.delete.next(this.id);
    }

    public generateDisplayMessage(): void {
        // if (!this.field) { return; }
        // const cols: Array<ITableColumn> = this.cache.columns;
        // let col: ITableColumn = cols.filter(x => x.field === this.field)[0];
        // this.fieldName = col ? col.name : '';
        // let op: SelectItem = this.operator && FILTEROPERATORS.filter(x => x.value === this.operator)[0];
        // this.operatorName = op ? op.label : '';
        // this.text = null;
        // if (this.cache.fieldInfos && this.cache.fieldInfos[this.field]) {
        //     let it: ISelectOption = this.cache.fieldInfos[this.field].filter(x => `${x.value}` === `${this.value}`)[0];
        //     if (it) {
        //         this.text = it.text;
        //     }
        // }
    }
}
