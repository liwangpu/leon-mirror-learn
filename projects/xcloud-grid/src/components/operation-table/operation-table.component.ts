import { Component, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { Table } from '../../models/table';
import { GridOpsatService } from '../../services/grid-opsat.service';

@Component({
    selector: 'xcloud-grid-operation-table',
    templateUrl: './operation-table.component.html',
    styleUrls: ['./operation-table.component.scss']
})
export class OperationTableComponent extends Table implements OnChanges {

    @Input()
    public flowProcessKey: string;
    public enableRowOperation: boolean = true;
    public constructor(
        private renderer2: Renderer2,
        opsat: GridOpsatService
    ) {
        super(opsat);
    }
    public ngOnChanges(changes: SimpleChanges): void {

        // 锁住操作表格的宽度,避免因为动态生成审核按钮导致操作表格宽度动态增加导致页面抖动
        // 目前没有想到啥简单的办法,先这样实施
        if (changes.datas.firstChange) {
            setTimeout(() => {
                const rect: any = this.table.nativeElement.getBoundingClientRect();
                this.renderer2.setStyle(this.table.nativeElement, 'width', `${rect.width}px`);
            }, 500);
        }
    }

    public editRow(row: any): void {
        this.opsat.publish(GridTopicEnum.RowOperating, {
            operation: 'edit',
            data: row
        });
    }

}
