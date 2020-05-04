import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { MessageFlowEnum } from '../enums/message-flow.enum';

@Injectable()
export class GridMessageFlowService {

    public get message(): Observable<{ topic: string | MessageFlowEnum; data?: any }> {
        return this._message.asObservable();
    }
    private _message: Subject<{ topic: string | MessageFlowEnum; data?: any }> = new ReplaySubject<{ topic: string; data?: any }>(50);

    public ngOnDestroy(): void {
        this._message.complete();
        this._message.unsubscribe();
    }

    public publish(topic: string | MessageFlowEnum, data?: any): void {
        if (this._message.isStopped || this._message.closed) {
            return;
        }
        this._message.next({ topic, data });
    }
}
