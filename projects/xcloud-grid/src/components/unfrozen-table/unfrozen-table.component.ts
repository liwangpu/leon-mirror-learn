import { Component, forwardRef, OnInit, Renderer2 } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IFilterView } from '../../models/i-filter-view';
import { ITableColumn } from '../../models/i-table-column';
import { ResizableTable } from '../../models/resizable-table';
import { GridDataService } from '../../services/grid-data.service';
import { GridOpsatService } from '../../services/grid-opsat.service';

@Component({
    selector: 'xcloud-grid-unfrozen-table',
    templateUrl: './unfrozen-table.component.html',
    styleUrls: ['./unfrozen-table.component.scss'],
    providers: [
        {
            provide: ResizableTable,
            useExisting: forwardRef(() => UnFrozenTableComponent)
        }
    ]
})
export class UnFrozenTableComponent extends ResizableTable implements OnInit {

    public advanceColSettingMenu: Array<MenuItem>;
    public currentEditColumn: string;
    protected tableType: 'frozen' | 'unfrozen' = 'unfrozen';
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
                id: 'freezen-column',
                label: '冻结此列',
                command: () => {
                    this.cache.freezeColumn(this.currentEditColumn);
                }
            }
        ];

        // 订阅取消冻结或者隐藏表格列事件,取消表格所占宽度
        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.UnFreezeColumn))
        //     .subscribe(() => {
        //         this.renderer2.removeStyle(this.table.nativeElement, 'width');
        //     });
    }

}
