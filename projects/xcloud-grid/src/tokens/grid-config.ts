import { InjectionToken } from '@angular/core';

export interface IGridConfig {
    rowsPerPageOptions: Array<number>;
}

export const GRIDCONFIG: InjectionToken<IGridConfig> = new InjectionToken<IGridConfig>('grid config');
