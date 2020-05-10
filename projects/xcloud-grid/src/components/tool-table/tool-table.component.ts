import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Table } from '../../models/table';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { MessageFlowEnum } from '../../enums/message-flow.enum';

@Component({
    selector: 'xcloud-grid-tool-table',
    templateUrl: './tool-table.component.html',
    styleUrls: ['./tool-table.component.scss']
})
export class ToolTableComponent extends Table implements OnChanges {

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

    public selectAllRows(): void {
        for (let it of this.datas) {
            if (it['_level'] && it['_level'] > 1) { continue; }
            if (it['_hidden']) { continue; }
            it['_selected'] = this.allRowSelected;
        }
        this.messageFlow.publish(MessageFlowEnum.RowSelected, this.datas.filter(x => x['_selected']));
    }

}
