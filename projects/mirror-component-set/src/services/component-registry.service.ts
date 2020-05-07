import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { IComponentRegistry } from 'mirror-deed';
import { TestFormComponent } from '../components/test-form/test-form.component';
import { TestTabComponent } from '../components/test-tab/test-tab.component';
import { TestTreeComponent } from '../components/test-tree/test-tree.component';

@Injectable()
export class ComponentRegistryService implements IComponentRegistry {

    public constructor(
        private cfr: ComponentFactoryResolver
    ) { }

    public generateComponentFactory(control: string): ComponentFactory<any> {
        // tslint:disable-next-line: no-small-switch
        switch (control) {
            case 'test-form':
                return this.cfr.resolveComponentFactory(TestFormComponent);
            case 'test-tab':
                return this.cfr.resolveComponentFactory(TestTabComponent);
            case 'test-tree':
                return this.cfr.resolveComponentFactory(TestTreeComponent);
            default:
                break;
        }
        return null;
    }
}
