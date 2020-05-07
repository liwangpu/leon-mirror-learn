import { Injectable } from '@angular/core';
import { IComponentDesignDataStore, IComponentMetaData } from 'mirror-deed';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class ComponentDesignDataStoreService implements IComponentDesignDataStore {

    private jsonDirectory: string = '/assets/component-design-data-store';
    private cache: Map<string, any> = new Map();
    public constructor(
        private http: HttpClient
    ) { }

    public getMetaData(key: string): Observable<IComponentMetaData> {
        if (this.cache.has(key)) {
            return of(this.cache.get(key));
        }
        const configFile: string = `${this.jsonDirectory}/${key}.json`;
        return this.http.get(configFile).pipe(tap(res => this.cache.set(key, res))) as any;
    }
}
