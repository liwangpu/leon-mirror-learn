import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IDycMessage {
    topic: string;
    from: string;
    data?: { [key: string]: any };
}

export interface IDynamicComponentOpsat {
    readonly message: Observable<IDycMessage>;
    publish(topic: string, from: string, data?: any): void;
}

export const DYNAMICCOMPONENTOPSAT: InjectionToken<IDynamicComponentOpsat> = new InjectionToken<IDynamicComponentOpsat>('dynamic component opsat');