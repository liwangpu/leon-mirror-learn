import { Component, Inject, OnInit } from '@angular/core';
import { delay, filter, map, take } from 'rxjs/operators';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IHistory } from '../../models/i-history';
import { IQueryResult } from '../../models/i-query-result';
import { GridDataService } from '../../services/grid-data.service';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { topicFilter, dataMap } from '../../utils/grid-tool';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { DStoreOption } from '../../models/dstore';

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
        private opsat: GridOpsatService,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService,
    ) {
        this.rowsPerPageOptions = this.gridConfig.rowsPerPageOptions;
    }

    public ngOnInit(): void {
        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.ListData))
        //     .pipe(map(x => x.data))
        //     .pipe(delay(100))
        //     .subscribe((res: IQueryResult) => {
        //         if (res.count) {
        //             this.dataTotal = res.count;
        //         }
        //     });
        // this.opsat.message
        //     .pipe(filter(x => x.topic === GridTopicEnum.History))
        //     .pipe(map(x => x.data))
        //     .pipe(delay(100))
        //     .subscribe((history: IHistory) => {
        //         this.paginatorFirst = history.pagination.page - 1 > 0 ? (history.pagination.page - 1) * history.pagination.limit : 0;
        //     });

        this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ListData), dataMap)
            .subscribe((res: IQueryResult) => {
                // console.log(1, res);
                // this.selectMode = option.selectMode;
                if (res.count) {
                    this.dataTotal = res.count;
                }
            });
    }

    public paginate(evt: { first: number; rows: number; page: number }): void {
        this.paginatorFirst = evt.first;
        // this.cache.history.pagination.page = evt.page + 1;
        // this.cache.history.pagination.limit = evt.rows;
        this.cache.setPagination(evt.page + 1, evt.rows);
        // this.opsat.publish(GridTopicEnum._HistoryChange, this.cache.history);
    }

}
