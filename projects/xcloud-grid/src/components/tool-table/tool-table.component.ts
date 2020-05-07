import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { Table } from '../../models/table';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';

@Component({
    selector: 'xcloud-grid-tool-table',
    templateUrl: './tool-table.component.html',
    styleUrls: ['./tool-table.component.scss']
})
export class ToolTableComponent extends Table implements OnChanges {

    @Input()
    public selectMode: 'single' | 'multiple' = 'multiple';
    @Input()
    public radioSelect: string;
    @Output()
    public readonly radioSelectChange: EventEmitter<string> = new EventEmitter<string>();
    public allRowSelected: boolean = false;
    public constructor(
        messageFlow: GridMessageFlowService
    ) {
        super(messageFlow);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['datas']) {
            this.allRowSelected = false;
        }
    }

    public onRowClick(data: any): void {

    }

    public selectAllRows(): void {

    }

}
