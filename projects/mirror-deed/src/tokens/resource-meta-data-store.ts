import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { IResourceMetaData } from '../models/i-resource-meta-data';

export interface IResourceMetaDataStore {
    getMetaData(key: string): Observable<IResourceMetaData>;
}

export const RESOURCEMETADATASTORE: InjectionToken<IResourceMetaDataStore> = new InjectionToken<IResourceMetaDataStore>('resource meta data store');
