import { InjectionToken } from '@angular/core';
import { IComponentMetaData } from '../models/i-component-meta-data';
import { IDynamicComponent } from '../models/i-dynamic-component';

export interface IDynamicComponentRenderer {
    renderComponent(componentMetaDat: IComponentMetaData, parent: IDynamicComponent): void;
}

export const DYNAMICCOMPONENTRENDERER: InjectionToken<IDynamicComponentRenderer> = new InjectionToken<IDynamicComponentRenderer>('dynamic component renderer');