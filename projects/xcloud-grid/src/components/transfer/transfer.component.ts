import { Component, Input, SimpleChanges, OnChanges, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Subject, combineLatest, Subscription } from 'rxjs';
import { ArrayTool } from '../../utils/array-tool';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface ITransferItem {
    value: any;
    lable: string;
}

@Component({
    selector: 'xcloud-grid-transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferComponent implements OnChanges, OnDestroy {

    @Output()
    public readonly change: EventEmitter<[Array<ITransferItem>, Array<ITransferItem>]> = new EventEmitter<[Array<ITransferItem>, Array<ITransferItem>]>();
    @Input()
    public titles: [string, string] = ['源列表', '目的列表'];
    @Input()
    public listWidth: string = '200px';
    @Input()
    public datas: Array<ITransferItem>;
    @Input()
    public targetKeys: Array<string>;
    public _sourceDatas: Array<ITransferItem> = [];
    public _targetDatas: Array<ITransferItem> = [];
    public _allSourceDataSeleted: boolean;
    public _allTargetDataSelected: boolean;
    private dataChangeObs = new Subject<void>();
    private targetKeysChangeObs = new Subject<void>();
    private generateListDataProcessing: Subscription;
    constructor() {
        this.generateListDataProcessing = combineLatest(this.dataChangeObs, this.targetKeysChangeObs)
            .subscribe(() => {
                this._sourceDatas = this.datas.filter(x => !this.targetKeys.some(t => t === x.value));
                this._targetDatas = this.datas.filter(x => this.targetKeys.some(t => t === x.value));
                // console.log('generateListDataProcessing work');
            });
    }

    public ngOnDestroy(): void {
        this.dataChangeObs.complete();
        this.dataChangeObs.unsubscribe();
        this.targetKeysChangeObs.complete();
        this.targetKeysChangeObs.unsubscribe();
        this.generateListDataProcessing.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.datas && changes.datas.currentValue && changes.datas.currentValue.length) {
            this.dataChangeObs.next();
        }

        if (changes.targetKeys) {
            this.targetKeysChangeObs.next();
        }
    }

    public selectAllSourceData(): void {
        if (!this._sourceDatas) { return; }
        this._sourceDatas.forEach(s => s['_selected'] = this._allSourceDataSeleted);
    }

    public selectAllTargetData(): void {
        if (!this._targetDatas) { return; }
        this._targetDatas.forEach(s => s['_selected'] = this._allTargetDataSelected);
    }

    public moveSourceToTarget(): void {
        if (!this._sourceDatas || !this._sourceDatas.length) { return; }
        let ss: Array<any> = this._sourceDatas.filter(x => x['_selected']);
        ArrayTool.remove(this._sourceDatas, s => s['_selected']);
        ss.forEach(s => {
            s['_selected'] = false;
            this._targetDatas.push(s);
        });
        this.autoJudgeAllSourceSelected();
        this.notifyChange();
    }

    public moveTargetToSource(): void {
        if (!this._targetDatas || !this._targetDatas.length) { return; }
        let ts: Array<any> = this._targetDatas.filter(x => x['_selected']);
        ArrayTool.remove(this._targetDatas, s => s['_selected']);
        ts.forEach(s => {
            s['_selected'] = false;
            this._sourceDatas.push(s);
        });
        this.autoJudgeAllTargetSelected();
        this.notifyChange();
    }

    public autoJudgeAllSourceSelected(): void {
        if (!this._sourceDatas || !this._sourceDatas.length) {
            this._allSourceDataSeleted = false;
            return;
        }

        if (this._allSourceDataSeleted) {
            if (this._sourceDatas.some(s => !s['_selected'])) {
                this._allSourceDataSeleted = false;
            }
        } else {
            if (this._sourceDatas.every(s => s['_selected'])) {
                this._allSourceDataSeleted = true;
            }
        }
    }

    public autoJudgeAllTargetSelected(): void {
        if (!this._targetDatas || !this._targetDatas.length) {
            this._allTargetDataSelected = false;
            return;
        }

        if (this._allTargetDataSelected) {
            if (this._targetDatas.some(s => !s['_selected'])) {
                this._allTargetDataSelected = false;
            }
        } else {
            if (this._targetDatas.every(s => s['_selected'])) {
                this._allTargetDataSelected = true;
            }
        }
    }

    public dropSource(event: CdkDragDrop<string[]>) {
        moveItemInArray(this._sourceDatas, event.previousIndex, event.currentIndex);
        this.notifyChange();
    }

    public dropTarget(event: CdkDragDrop<string[]>) {
        moveItemInArray(this._targetDatas, event.previousIndex, event.currentIndex);
        this.notifyChange();
    }

    private notifyChange(): void {
        this.change.emit([this._targetDatas, this._sourceDatas]);
    }
}
