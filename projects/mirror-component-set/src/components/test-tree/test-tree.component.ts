import { Component, OnInit, OnDestroy, Injector, forwardRef } from '@angular/core';
import { DynamicComponent } from 'mirror-deed';

@Component({
    selector: 'mirror-component-set-test-tree',
    templateUrl: './test-tree.component.html',
    styleUrls: ['./test-tree.component.scss'],
    providers: [
        {
            provide: DynamicComponent,
            useExisting: forwardRef(() => TestTreeComponent)
        }
    ]
})
export class TestTreeComponent extends DynamicComponent implements OnInit, OnDestroy {


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

    protected async afterRenderer(): Promise<void> {
        console.log('test tree ready');
    }

    protected async onReceiveMessage(topic: string, data?: any): Promise<void> {
        console.log('test tree receive messsage', topic, data);
    }

    protected async initialize(value?: any): Promise<void> {

    }

}
