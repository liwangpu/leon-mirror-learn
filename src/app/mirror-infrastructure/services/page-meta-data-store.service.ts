import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPageMetaDataStore, IPageMetaData } from 'mirror-deed';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PageMetaDataStoreService implements IPageMetaDataStore {

    private jsonDirectory: string = '/assets/page-meta-data-store';
    private cache: Map<string, any> = new Map();
    public constructor(
        private http: HttpClient
    ) { }

    public getMetaData(key: string): Observable<IPageMetaData> {
        if (this.cache.has(key)) {
            return of(this.cache.get(key));
        }
        const configFile: string = `${this.jsonDirectory}/${key}.json`;
        return this.http.get(configFile).pipe(tap(res => this.cache.set(key, res))) as any;
    }

}
