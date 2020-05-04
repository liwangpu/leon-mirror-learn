import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { ComponentDiscoveryService } from './services/component-discovery.service';
import { COMPONENTDISCOVERY, PAGEMETADATASTORE, COMPONENTDESIGNDATASTORE } from 'mirror-deed';
import { PageMetaDataStoreService } from './services/page-meta-data-store.service';
import { ComponentDesignDataStoreService } from './services/component-design-data-store.service';

@NgModule()
export class MirrorInfrastructureModule {

    public constructor(@Optional() @SkipSelf() parentModule: MirrorInfrastructureModule) {
        if (parentModule) {
            throw new Error('infrastructore模块使用forRoot()引用,其他模块不需要再引用了!');
        }
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: MirrorInfrastructureModule,
            providers: [
                ComponentDiscoveryService,
                PageMetaDataStoreService,
                ComponentDesignDataStoreService,
                {
                    provide: COMPONENTDISCOVERY,
                    useExisting: ComponentDiscoveryService,
                },
                {
                    provide: PAGEMETADATASTORE,
                    useExisting: PageMetaDataStoreService
                },
                {
                    provide: COMPONENTDESIGNDATASTORE,
                    useExisting: ComponentDesignDataStoreService
                },
            ]
        };
    }
}
