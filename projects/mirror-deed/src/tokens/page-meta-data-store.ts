import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IPageMetaData } from '../models/i-page-meta-data';

export interface IPageMetaDataStore {
    getMetaData(key: string): Observable<IPageMetaData>;
}

export const PAGEMETADATASTORE: InjectionToken<IPageMetaDataStore> = new InjectionToken<IPageMetaDataStore>('page meta data store');
