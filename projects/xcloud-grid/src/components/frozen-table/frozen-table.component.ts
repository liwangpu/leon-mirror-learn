import { Component, forwardRef, OnInit, Renderer2 } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ResizableTable } from '../../models/resizable-table';
import { GridDataService } from '../../services/grid-data.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { MessageFlowEnum } from '../../enums/message-flow.enum';

@Component({
    selector: 'xcloud-grid-frozen-table',
    templateUrl: './frozen-table.component.html',
    styleUrls: ['./frozen-table.component.scss'],
    providers: [
        {
            provide: ResizableTable,
            useExisting: forwardRef(() => FrozenTableComponent)
        }
    ]
})
export class FrozenTableComponent extends ResizableTable implements OnInit {

    public advanceColSettingMenu: Array<MenuItem>;
    public currentEditColumn: string;
    public currentTableCell: Element;
    protected tableType: 'frozen' | 'unfrozen' = 'frozen';
    public constructor(
        renderer2: Renderer2,
        cache: GridDataService,
        dataFlow: GridDataFlowService,
        messageFlow: GridMessageFlowService
    ) {
        super(renderer2, cache, dataFlow, messageFlow);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.advanceColSettingMenu = [
            {
                id: 'unfreezen-column',
                label: '取消冻结',
                command: () => {
                    if (this.columns.length > 1) {
                        //取消冻结需要减去该列的宽度,不然冻结表格不会取消占位该列占位宽度
                        let tableWidth: number = 0;
                        let thWdith: number = 0;
                        let tableRect: DOMRect = this.table.nativeElement.getBoundingClientRect();
                        tableWidth = tableRect.width;
                        let thRect: DOMRect = this.currentTableCell.getBoundingClientRect();
                        thWdith = thRect.width;
                        this.renderer2.setStyle(this.table.nativeElement, 'width', `${tableWidth - thWdith}px`);
                    } else {
                        this.renderer2.setStyle(this.table.nativeElement, 'width', `auto`);
                    }
                    this.cache.unfreezenColumn(this.currentEditColumn);
                    this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view: this.cache.getActiveFilterView(), fetchData: false });
                }
            }
        ];
    }

}
