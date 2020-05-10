import { Component, Inject, OnInit } from '@angular/core';
import { IQueryResult } from '../../models/i-query-result';
import { GridDataService } from '../../services/grid-data.service';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { topicFilter, dataMap } from '../../utils/grid-tool';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';

@Component({
    selector: 'xcloud-grid-footer',
    templateUrl: './grid-footer.component.html',
    styleUrls: ['./grid-footer.component.scss']
})
export class GridFooterComponent implements OnInit {

    public rowsPerPageOptions: Array<number>;
    public dataTotal: number = 0;
    public paginatorFirst: number = 0;
    public constructor(
        @Inject(GRIDCONFIG) private gridConfig: IGridConfig,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
    ) {
        this.rowsPerPageOptions = this.gridConfig.rowsPerPageOptions;
    }

    public ngOnInit(): void {
        this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ListData), dataMap)
            .subscribe((res: IQueryResult) => {
                if (res.count) {
                    this.dataTotal = res.count;
                }
            });
    }

    public paginate(evt: { first: number; rows: number; page: number }): void {
        this.paginatorFirst = evt.first;
        this.cache.setPagination(evt.page + 1, evt.rows);
    }

}
