import { Injectable, OnDestroy } from '@angular/core';
import { IDynamicComponentOpsat, IDycMessage } from 'mirror-deed';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DynamicComponentOpsatService implements IDynamicComponentOpsat, OnDestroy {

    public get message(): Observable<IDycMessage> {
        return this._message.asObservable();
    };
    private _message: Subject<IDycMessage> = new Subject<IDycMessage>();

    public ngOnDestroy(): void {
        this._message.complete();
        this._message.unsubscribe();
    }

    public publish(topic: string, from: string, data?: any): void {
        if (this._message.isStopped || this._message.closed) {
            return;
        }
        this._message.next({ topic, from, data });
    }
}
