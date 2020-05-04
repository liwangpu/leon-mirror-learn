import { INotification } from './i-notification';
import { InjectionToken } from '@angular/core';

export interface IComponentMetaData {
    key?: string;
    title?: string;
    control?: string;
    dataSourceKey?: string;
    containerId?: string;
    content?: Array<IComponentMetaData>;
    notify?: Array<INotification>;
    subscribe?: Array<INotification>;
}

export const COMPONENTMETADATA: InjectionToken<IComponentMetaData> = new InjectionToken<IComponentMetaData>('component design data');