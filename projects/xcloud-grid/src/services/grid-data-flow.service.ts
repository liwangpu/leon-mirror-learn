import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DataFlowTopicEnum } from '../enums/data-flow-topic.enum';

@Injectable()
export class GridDataFlowService implements OnDestroy  {

    public get message(): Observable<{ topic: string | DataFlowTopicEnum; data?: any }> {
        return this._message.asObservable();
    }
    private _message: Subject<{ topic: string | DataFlowTopicEnum; data?: any }> = new ReplaySubject<{ topic: string; data?: any }>(50);

    public ngOnDestroy(): void {
        this._message.complete();
        this._message.unsubscribe();
    }

    public publish(topic: string | DataFlowTopicEnum, data?: any): void {
        if (this._message.isStopped || this._message.closed) {
            return;
        }
        this._message.next({ topic, data });
    }
}
