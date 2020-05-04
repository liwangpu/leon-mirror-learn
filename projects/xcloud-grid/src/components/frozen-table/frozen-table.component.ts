import { Component, forwardRef, OnInit, Renderer2 } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IFilterView } from '../../models/i-filter-view';
import { ITableColumn } from '../../models/i-table-column';
import { ResizableTable } from '../../models/resizable-table';
import { GridDataService } from '../../services/grid-data.service';
import { GridOpsatService } from '../../services/grid-opsat.service';

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
        opsat: GridOpsatService,
    ) {
        super(renderer2, cache, opsat);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.advanceColSettingMenu = [
            {
                id: 'unfreezen-column',
                label: '取消冻结',
                command: () => {
                    // console.log(1, this.currentTableCell);
                    this.cache.unfreezenColumn(this.currentEditColumn);
                }
            }
        ];

    }

}
