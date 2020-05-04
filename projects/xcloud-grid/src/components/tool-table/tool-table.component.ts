import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { Table } from '../../models/table';
import { GridOpsatService } from '../../services/grid-opsat.service';

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
        opsat: GridOpsatService
    ) {
        super(opsat);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['datas']) {
            this.allRowSelected = false;
        }
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
    }

    public selectAllRows(): void {
        for (let it of this.datas) {
            if (it['_level'] && it['_level'] > 1) { continue; }
            if (it['_hidden']) { continue; }
            it['selected'] = this.allRowSelected;
        }
        this.opsat.publish(GridTopicEnum.RowSelected, this.datas.filter(x => x['selected']));
    }

}
