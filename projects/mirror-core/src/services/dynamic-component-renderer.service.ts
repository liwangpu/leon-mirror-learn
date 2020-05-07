import { Injectable, ViewContainerRef, Inject } from '@angular/core';
import { IDynamicComponentRenderer, IComponentMetaData, COMPONENTDESIGNDATASTORE, IComponentDesignDataStore, COMPONENTDISCOVERY, IComponentDiscovery, IDynamicComponent } from 'mirror-deed';
import { iif, of } from 'rxjs';

@Injectable()
export class DynamicComponentRendererService implements IDynamicComponentRenderer {

    public constructor(
        @Inject(COMPONENTDESIGNDATASTORE) private componentDesignDataStore: IComponentDesignDataStore,
        @Inject(COMPONENTDISCOVERY) private componentDiscovery: IComponentDiscovery
    ) { }

    public renderComponent(componentMetaDat: IComponentMetaData,parent: IDynamicComponent): void {
        // if (!placeAt) {
        //     console.error('render component将不执行,因为placeAt为空');
        //     return;
        // }

        // console.log('c meta data', componentMetaDat.key);

        iif(() => Boolean(componentMetaDat.key), this.componentDesignDataStore.getMetaData(componentMetaDat.key), of(componentMetaDat))
            .subscribe(metaData => {
                console.log('c meta data', metaData);
            });
        // this.componentDesignDataStore.getMetaData()

    }
}
