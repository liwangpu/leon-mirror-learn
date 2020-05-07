import { Injectable, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { IComponentRegistry } from 'mirror-deed';
import { BlankLayoutComponent } from '../components/blank-layout/blank-layout.component';
import { FlexRowLayoutComponent } from '../components/flex-row-layout/flex-row-layout.component';

@Injectable()
export class ComponentRegistryService implements IComponentRegistry {

    public constructor(
        private cfr: ComponentFactoryResolver
    ) { }

    public generateComponentFactory(control: string): ComponentFactory<any> {
        // tslint:disable-next-line: no-small-switch
        switch (control) {
            case 'blank-layout':
                return this.cfr.resolveComponentFactory(BlankLayoutComponent);
            case 'flex-row-layout':
                return this.cfr.resolveComponentFactory(FlexRowLayoutComponent);
            default:
                break;
        }
        return null;
    }
}
