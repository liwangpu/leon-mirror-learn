import { Component, OnInit, Injector, AfterViewInit, OnDestroy, forwardRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponent, DynamicContainer } from 'mirror-deed';

@Component({
    selector: 'mirror-component-set-test-form',
    templateUrl: './test-form.component.html',
    styleUrls: ['./test-form.component.scss'],
    providers: [
        {
            provide: DynamicComponent,
            useExisting: forwardRef(() => TestFormComponent)
        }
    ]
})
export class TestFormComponent extends DynamicComponent implements AfterViewInit, OnDestroy {

    @ViewChild('formContainer', { static: true, read: ViewContainerRef })
    @DynamicContainer()
    private formContainer: ViewContainerRef;
    public constructor(
        injector: Injector
    ) {
        super(injector);
    }

    public async ngAfterViewInit(): Promise<void> {
        await this.startup();
    }

    public async ngOnDestroy(): Promise<void> {
        await this.destroy();
    }

    protected async afterRenderer(): Promise<void> {
        console.log('test form ready');
    }

    protected async onReceiveMessage(topic: string, data?: any): Promise<void> {
        console.log('test form receive messsage', topic, data);
    }

    protected async initialize(value?: any): Promise<void> {

    }
}
