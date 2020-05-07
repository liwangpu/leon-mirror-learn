import { Component } from '@angular/core';
import { Table } from '../../models/table';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';

@Component({
    selector: 'xcloud-grid-operation-table',
    templateUrl: './operation-table.component.html',
    styleUrls: ['./operation-table.component.scss']
})
export class OperationTableComponent extends Table {

    public enableRowState = true;
    public constructor(
        messageFlow: GridMessageFlowService
    ) {
        super(messageFlow);
    }


    public editRow(row: any): void {
        // this.opsat.publish(GridTopicEnum.RowOperating, {
        //     operation: 'edit',
        //     data: row
        // });
    }

}
