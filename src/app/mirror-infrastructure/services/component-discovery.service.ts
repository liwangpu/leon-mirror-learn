import { Injectable, ComponentFactory, Inject } from '@angular/core';
import { COMPONENTREGISTRY, IComponentRegistry, IComponentDiscovery } from 'mirror-deed';

@Injectable()
export class ComponentDiscoveryService implements IComponentDiscovery {

    public constructor(
        @Inject(COMPONENTREGISTRY) private componentRegistries: Array<IComponentRegistry>
    ) { }

    public generateComponentFactory(control: string): ComponentFactory<any> {

        if (this.componentRegistries && this.componentRegistries.length > 0) {
            for (let idx: number = this.componentRegistries.length - 1; idx >= 0; idx--) {
                let registry: IComponentRegistry = this.componentRegistries[idx];
                let fac: ComponentFactory<any> = registry.generateComponentFactory(control);
                if (fac) {
                    return fac;
                }
            }
        }
        return null;
    }
}
