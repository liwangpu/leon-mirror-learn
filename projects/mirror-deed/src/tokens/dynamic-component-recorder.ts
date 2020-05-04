import { InjectionToken } from '@angular/core';
import { IDynamicComponent } from '../models/i-dynamic-component';

export interface IDynamicComponentRecorder {
    recordDynamicComponent(dyc: IDynamicComponent, parentId: string): void;
    recordDynamicComponentDestroy(componentId: string): void;
}

export const DYNAMICCOMPONENTRECORDER: InjectionToken<IDynamicComponentRecorder> = new InjectionToken<IDynamicComponentRecorder>('dynamic component recorder');