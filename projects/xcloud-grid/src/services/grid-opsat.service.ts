import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { GridTopicEnum } from '../enums/grid-topic.enum';

@Injectable()
export class GridOpsatService implements OnDestroy {

    public get message(): Observable<{ topic: string | GridTopicEnum; data?: any }> {
        return this._message.asObservable();
    }
    private _message: Subject<{ topic: string | GridTopicEnum; data?: any }> = new ReplaySubject<{ topic: string; data?: any }>(50);

    public ngOnDestroy(): void {
        this._message.complete();
        this._message.unsubscribe();
    }

    public publish(topic: string | GridTopicEnum, data?: any): void {
        if (this._message.isStopped || this._message.closed) {
            return;
        }
        this._message.next({ topic, data });
    }
}
