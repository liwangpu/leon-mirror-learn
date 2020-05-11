import { InjectionToken } from '@angular/core';
import { IHistory } from '../models/i-history';

export interface IQueryParamTransformPolicy {
    transform(param?: IHistory): { [key: string]: any };
}

export const QUERYPARAMTRANSFORMPOLICY: InjectionToken<IQueryParamTransformPolicy> = new InjectionToken<IQueryParamTransformPolicy>('grid query param transform policy');
