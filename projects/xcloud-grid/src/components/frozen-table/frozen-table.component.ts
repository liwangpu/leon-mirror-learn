import { Component, forwardRef, OnInit, Renderer2 } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ResizableTable } from '../../models/resizable-table';
import { GridDataService } from '../../services/grid-data.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';

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
        messageFlow: GridMessageFlowService
    ) {
        super(renderer2, cache, messageFlow);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.advanceColSettingMenu = [
            {
                id: 'unfreezen-column',
                label: '取消冻结',
                command: () => {
                    if (this.columns.length > 2) {
                        //取消冻结需要减去该列的宽度,不然冻结表格不会取消占位该列占位宽度
                        // 之前跳转列宽的时候已经在attr.sign-width顺手标记了一下宽度,省得总是的计算,但是如果没有标记,就需要计算
                        let tableWidth: number = 0;
                        let thWdith: number = 0;
                        let tableSignWidthStr = this.table.nativeElement.getAttribute('sign-width');
                        if (tableSignWidthStr) {
                            tableWidth = Number(tableSignWidthStr);
                        } else {
                            let rect: DOMRect = this.table.nativeElement.getBoundingClientRect();
                            tableWidth = rect.width;
                        }
                        let thSignWidthStr: string = this.currentTableCell.getAttribute('sign-width');
                        if (thSignWidthStr) {
                            thWdith = Number(thSignWidthStr);
                        } else {
                            let rect: DOMRect = this.currentTableCell.getBoundingClientRect();
                            thWdith = rect.width;
                        }
                        this.renderer2.setStyle(this.table.nativeElement, 'width', `${tableWidth - thWdith}px`);
                    }
                    this.cache.unfreezenColumn(this.currentEditColumn);
                }
            }
        ];
    }

}
