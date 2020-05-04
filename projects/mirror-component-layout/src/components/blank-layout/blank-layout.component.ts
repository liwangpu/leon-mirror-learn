import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { DynamicComponent, DynamicContainer } from 'mirror-deed';

@Component({
    selector: 'mirror-component-layout-blank-layout',
    templateUrl: './blank-layout.component.html',
    styleUrls: ['./blank-layout.component.scss']
})
export class BlankLayoutComponent extends DynamicComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('componentContainer', { static: true, read: ViewContainerRef })
    @DynamicContainer()
    protected componentContainer: ViewContainerRef;
    public constructor(
        injector: Injector
    ) {
        super(injector);
    }


    public ngOnInit(): void {

    }

    public async ngOnDestroy(): Promise<void> {
        await this.destroy();
    }

    // @ContainerIsReady()
    public async ngAfterViewInit(): Promise<void> {
        await this.startup();
    }


    protected async afterRenderer(): Promise<void> {
        console.log('blank layout ready');
    }

    protected async onReceiveMessage(topic: string, data?: any): Promise<void> {

    }

    protected async initialize(value?: any): Promise<void> {

    }


}
