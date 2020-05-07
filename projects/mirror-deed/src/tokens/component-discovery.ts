import { ComponentFactory, InjectionToken } from '@angular/core';

export interface IComponentDiscovery {
    generateComponentFactory(control: string): ComponentFactory<any>;
}

export const COMPONENTDISCOVERY: InjectionToken<IComponentDiscovery> = new InjectionToken<IComponentDiscovery>('component discovery');
