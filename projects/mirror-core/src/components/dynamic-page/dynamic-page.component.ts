import { Component, OnInit, Inject, ViewChild, ViewContainerRef, ComponentRef, Injector } from '@angular/core';
import { DYNAMICCOMPONENTRENDERER, IDynamicComponentRenderer, IPageMetaData, COMPONENTDISCOVERY, IComponentDiscovery, IComponentMetaData, COMPONENTMETADATA, DynamicComponent, DynamicContainer, DYNAMICCOMPONENTOPSAT, DYNAMICCOMPONENTRECORDER } from 'mirror-deed';
import { DynamicComponentRendererService } from '../../services/dynamic-component-renderer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DynamicComponentRecorderService } from '../../services/dynamic-component-recorder.service';
import { DynamicComponentOpsatService } from '../../services/dynamic-component-opsat.service';

@Component({
    selector: 'mirror-core-dynamic-page',
    templateUrl: './dynamic-page.component.html',
    styleUrls: ['./dynamic-page.component.scss'],
    providers: [
        DynamicComponentRendererService,
        DynamicComponentRecorderService,
        DynamicComponentOpsatService,
        {
            provide: DYNAMICCOMPONENTRENDERER,
            useExisting: DynamicComponentRendererService
        },
        {
            provide: DYNAMICCOMPONENTRECORDER,
            useExisting: DynamicComponentRecorderService
        },
        {
            provide: DYNAMICCOMPONENTOPSAT,
            useExisting: DynamicComponentOpsatService
        }
    ]
})
export class DynamicPageComponent extends DynamicComponent implements OnInit {

    @ViewChild('layoutContainer', { static: true, read: ViewContainerRef })
    @DynamicContainer()
    private layoutContainer: ViewContainerRef;
    private pageMetaData: IPageMetaData;
    public constructor(
        private acr: ActivatedRoute,
        private router: Router,
        injector: Injector
    ) {
        super(injector);
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.acr.data
            .pipe(map(x => x['pageMetaData']))
            .subscribe((metaData: IPageMetaData) => {
                this.layoutContainer?.clear();
                this.pageMetaData = metaData;
                this.metaData = {
                    content: [
                        this.pageMetaData.layout
                    ]
                };
                // console.log('page meta data change', metaData);
            });
    }

    // @RendererDynamicComponent()
    public ngOnInit(): void {
        this.startup();
    }

    public async afterRenderer(): Promise<void> {

    }

    protected async onReceiveMessage(topic: string, data?: any): Promise<void> {

    }

    protected async initialize(value?: any): Promise<void> {

    }

}
