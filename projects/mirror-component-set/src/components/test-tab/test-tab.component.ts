import { Component, OnInit, Injector, ViewChild, ViewContainerRef, OnDestroy, forwardRef } from '@angular/core';
import { DynamicComponent, DynamicContainer } from 'mirror-deed';

@Component({
    selector: 'mirror-component-set-test-tab',
    templateUrl: './test-tab.component.html',
    styleUrls: ['./test-tab.component.scss'],
    providers: [
        {
            provide: DynamicComponent,
            useExisting: forwardRef(() => TestTabComponent)
        }
    ]
})
export class TestTabComponent extends DynamicComponent implements OnInit, OnDestroy {

    @ViewChild('tabContainer', { static: true, read: ViewContainerRef })
    @DynamicContainer()
    private tabContainer: ViewContainerRef;
    public constructor(
        injector: Injector
    ) {
        super(injector);
    }

    public async ngOnInit(): Promise<void> {
        await this.startup();
    }

    public async ngOnDestroy(): Promise<void> {
        await this.destroy();
    }

    public clearChildrenDyc(): void {
        this.tabContainer.clear();
    }

    protected async afterRenderer(): Promise<void> {
        console.log('test tab ready');
    }

    protected async onReceiveMessage(topic: string, data?: any): Promise<void> {
        console.log('test tab receive messsage', topic, data);
    }

    protected async initialize(value?: any): Promise<void> {

    }

}
