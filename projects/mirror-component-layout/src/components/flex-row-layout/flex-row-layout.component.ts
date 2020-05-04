import { Component, OnInit, ViewChild, ViewContainerRef, Inject, AfterViewInit } from '@angular/core';
import { DynamicComponent, DynamicContainer, DYNAMICCOMPONENTRENDERER, IDynamicComponentRenderer, COMPONENTMETADATA, IComponentMetaData } from 'mirror-deed';

@Component({
    selector: 'mirror-component-layout-flex-row-layout',
    templateUrl: './flex-row-layout.component.html',
    styleUrls: ['./flex-row-layout.component.scss']
})
export class FlexRowLayoutComponent  implements OnInit, AfterViewInit {

    @ViewChild('leftComponentContainer', { static: false, read: ViewContainerRef })
    @DynamicContainer('left')
    private leftComponentContainer: ViewContainerRef;
    @ViewChild('rightComponentContainer', { static: false, read: ViewContainerRef })
    @DynamicContainer('right')
    private rightComponentContainer: ViewContainerRef;
    public constructor(
        @Inject(DYNAMICCOMPONENTRENDERER) dynamicComponentRenderer: IDynamicComponentRenderer,
        @Inject(COMPONENTMETADATA) metaData: IComponentMetaData
    ) {
        // super(metaData, dynamicComponentRenderer);
    }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        // this.startup();
    }

    protected afterRenderer(): void {

    }
}
