import { Component, OnInit } from '@angular/core';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IFilterView } from '../../models/i-filter-view';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataService } from '../../services/grid-data.service';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { ArrayTool } from '../../utils/array-tool';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'xcloud-grid-column-visual-editing-panel',
    templateUrl: './column-visual-editing-panel.component.html',
    styleUrls: ['./column-visual-editing-panel.component.scss']
})
export class ColumnVisualEditingPanelComponent implements OnInit {

    public get availableFields(): Array<ITableColumn> {
        if (!this.fields) { return []; }
        return this.fields.filter(x => x['invisibale']);
    }
    public get visualFields(): Array<ITableColumn> {
        if (!this.fields) { return []; }
        return this.fields.filter(x => !x['invisibale']);
    }
    private fields: Array<ITableColumn>;
    public constructor(
        public ref: DynamicDialogRef,
        private opsat: GridOpsatService,
        private cache: GridDataService,
    ) {

    }

    public ngOnInit(): void {
        // this.fields = ArrayTool.deepCopy(this.cache.columns);
    }

    public onAvailableFieldSelect(col: ITableColumn): void {
        for (let idx: number = this.availableFields.length - 1; idx >= 0; idx--) {
            let it: ITableColumn = this.availableFields[idx];

            it['active'] = it.field === col.field;
        }
    }

    public onVisualFieldSelect(col: ITableColumn): void {
        for (let idx: number = this.visualFields.length - 1; idx >= 0; idx--) {
            let it: ITableColumn = this.visualFields[idx];

            it['active'] = it.field === col.field;
        }
    }

    public moveToVisualField(): void {
        let active: ITableColumn = this.availableFields.filter(x => x['active'])[0];
        if (!active) { return; }

        for (let idx: number = this.availableFields.length - 1; idx >= 0; idx--) {
            let it: ITableColumn = this.availableFields[idx];
            if (it.field === active.field) {
                it['invisibale'] = false;
                it['active'] = false;
                break;
            }
        }
    }

    public moveToAvailableField(): void {
        let active: ITableColumn = this.visualFields.filter(x => x['active'])[0];
        if (!active) { return; }

        for (let idx: number = this.visualFields.length - 1; idx >= 0; idx--) {
            let it: ITableColumn = this.visualFields[idx];
            if (it.field === active.field) {
                it['invisibale'] = true;
                it['active'] = false;
                break;
            }
        }
    }

    public moveUpAvailableField(): void {
        let activeField: ITableColumn = this.visualFields.filter(x => x['active'] === true)[0];
        if (!activeField) { return; }
        if (this.visualFields.findIndex(x => x.field === activeField.field) === 0) { return; }
        let index: number = this.fields.findIndex(x => x.field === activeField.field);
        for (let i: number = index - 1; i >= 0; i--) {
            let it: ITableColumn = this.fields[i];
            if (!it['invisibale']) {
                this.fields[index] = it;
                this.fields[i] = activeField;
                break;
            }
        }
    }

    public moveDownAvailableField(): void {
        let activeField: ITableColumn = this.visualFields.filter(x => x['active'] === true)[0];
        if (!activeField) { return; }
        if (this.visualFields.findIndex(x => x.field === activeField.field) === this.visualFields.length - 1) { return; }
        let index: number = this.fields.findIndex(x => x.field === activeField.field);
        for (let i: number = index + 1, len: number = this.fields.length; i < len; i++) {
            let it: ITableColumn = this.fields[i];
            if (!it['invisibale']) {
                this.fields[i] = activeField;
                this.fields[index] = it;
                break;
            }
        }
    }

    public saveColumnChange(): void {
        // const view: IFilterView = this.cache.activeFilterView;
        // view.columns = this.fields;
        // this.opsat.publish(GridTopicEnum.ColumnVisialSettingChange);
        // this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, view);
        // this.ref.close();
    }

}
