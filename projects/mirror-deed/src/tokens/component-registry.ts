import { ComponentFactory, InjectionToken } from '@angular/core';

export interface IComponentRegistry {
    generateComponentFactory(control: string): ComponentFactory<any>;
}

export const COMPONENTREGISTRY: InjectionToken<IComponentRegistry> = new InjectionToken<IComponentRegistry>('component registry');
