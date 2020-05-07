import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { delay } from 'rxjs/operators';
import { EQ_OPERATOR, FILTEROPERATORS, GT_OPERATOR, GTE_OPERATOR, LIKE_OPERATOR, LT_OPERATOR, LTE_OPERATOR, NE_OPERATOR, NLIKE_OPERATOR } from '../../consts/filter-operators';
import { ColumnTypeEnum } from '../../enums/column-type-enum.enum';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataService } from '../../services/grid-data.service';
import { ArrayTool } from '../../utils/array-tool';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'xcloud-grid-filter-item-setting-panel',
    templateUrl: './filter-item-setting-panel.component.html',
    styleUrls: ['./filter-item-setting-panel.component.scss']
})
export class FilterItemSettingPanelComponent implements OnInit, AfterViewInit {

    public testOp: string = 'eq';
    public fieldType: ColumnTypeEnum;
    public editForm: FormGroup;
    public operators: Array<SelectItem> = FILTEROPERATORS;
    public fields: Array<SelectItem>;
    public values: Array<SelectItem>;
    public constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private fb: FormBuilder,
        private cache: GridDataService
    ) {
        this.editForm = this.fb.group({
            field: [],
            operator: [],
            value: []
        });
    }

    public ngOnInit(): void {
        // const cols: Array<ITableColumn> = ArrayTool.deepCopy(this.cache.columns);
        // this.fields = cols.map(x =>
        //     ({ label: x.name, value: x.field }));

        // this.editForm.get('field').valueChanges
        //     .pipe(delay(150))
        //     .subscribe(field => {
        //         let colIndex: number = cols.findIndex(x => x.field === field);
        //         let col: ITableColumn = cols[colIndex];
        //         this.fieldType = col.fieldType;

        //         // tslint:disable-next-line: prefer-switch
        //         if (col.fieldType === ColumnTypeEnum.Number) {
        //             this.settingNumberOperations();
        //         } else if (col.fieldType === ColumnTypeEnum.Select) {
        //             this.settingSelectOperations();
        //             if (this.cache.fieldInfos) {
        //                 this.values = this.cache.fieldInfos[field].map(x =>
        //                     ({ label: x.text, value: x.value }));
        //             }
        //         } else {
        //             this.settingStringOperations();
        //         }
        //     });

        // if (this.config.data) {
        //     this.editForm.patchValue(this.config.data);
        // } else {
        //     this.editForm.patchValue({ field: cols[0].field });
        // }
    }

    public ngAfterViewInit(): void {
        this.editForm.get('field').valueChanges.subscribe(() => {
            this.editForm.patchValue({ operator: null });
            this.editForm.patchValue({ value: '' });
        });

    }

    public save(): void {
        const form: any = this.editForm.value;
        this.ref.close(form);
    }

    private settingStringOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '包含', value: LIKE_OPERATOR },
            { label: '不包含', value: NLIKE_OPERATOR },
            { label: '等于', value: EQ_OPERATOR }
        ];
        this.operators = opts;
    }

    private settingNumberOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '等于', value: EQ_OPERATOR },
            { label: '不等于', value: NE_OPERATOR },
            { label: '小于', value: LT_OPERATOR },
            { label: '大于', value: GT_OPERATOR },
            { label: '小于等于', value: LTE_OPERATOR },
            { label: '大于等于', value: GTE_OPERATOR }
        ];
        this.operators = opts;
    }

    private settingSelectOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '等于', value: EQ_OPERATOR },
            { label: '不等于', value: NE_OPERATOR }
        ];
        this.operators = opts;
    }

}
