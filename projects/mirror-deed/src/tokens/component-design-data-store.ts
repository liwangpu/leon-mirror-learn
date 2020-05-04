import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IComponentMetaData } from '../models/i-component-meta-data';

export interface IComponentDesignDataStore {
    getMetaData(key: string): Observable<IComponentMetaData>;
}

export const COMPONENTDESIGNDATASTORE: InjectionToken<IComponentDesignDataStore> = new InjectionToken<IComponentDesignDataStore>('component design data store');
