import { ElementRef, Input, ViewChild } from '@angular/core';
import { GridOpsatService } from '../services/grid-opsat.service';
import { ITableColumn } from './i-table-column';

export abstract class Table {

    @Input()
    public columns: Array<ITableColumn> = [];
    @Input()
    public datas: Array<any> = [];
    @ViewChild('table', { static: false, read: ElementRef })
    public table: ElementRef;
    public constructor(
        protected opsat: GridOpsatService,
    ) {

    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

    public trackByColumnFn(inde: number, it: { field: string }): string {
        return it.field;
    }

}
