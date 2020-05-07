import { ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { ITableColumn } from './i-table-column';
import { GridMessageFlowService } from '../services/grid-message-flow.service';
import { Observable } from 'rxjs';
import { topicFilter, dataMap } from '../utils/grid-tool';
import { MessageFlowEnum } from '../enums/message-flow.enum';

export abstract class Table implements OnInit {

    @Input()
    public columns: Array<ITableColumn> = [];
    @Input()
    public datas: Array<any> = [];
    @ViewChild('table', { static: false, read: ElementRef })
    public table: ElementRef;
    public enableRowState = true;
    public constructor(
        protected messageFlow: GridMessageFlowService,
    ) {

    }
    ngOnInit(): void {
        const enableStateObs: Observable<boolean> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.EnableTableRowState), dataMap);

        enableStateObs
            .subscribe(enable => this.enableRowState = enable);
    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

    public trackByColumnFn(inde: number, it: { field: string }): string {
        return it.field;
    }

}
