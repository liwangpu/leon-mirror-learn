import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IPageMetaData, PAGEMETADATASTORE, IPageMetaDataStore } from 'mirror-deed';
import { Observable } from 'rxjs';

@Injectable()
export class PageMetaDataResolverService implements Resolve<IPageMetaData>  {

    public constructor(
        @Inject(PAGEMETADATASTORE) private pageMetaDataStore: IPageMetaDataStore
    ) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IPageMetaData | Observable<IPageMetaData> | Promise<IPageMetaData> {
        const pageKey: string = route.paramMap.get('metaKey');
        return this.pageMetaDataStore.getMetaData(pageKey);
    }
}
