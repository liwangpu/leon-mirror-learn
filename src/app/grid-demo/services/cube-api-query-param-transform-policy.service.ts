import { Injectable } from '@angular/core';
import { IQueryParamTransformPolicy, IFilter, IHistory } from 'xcloud-grid';

@Injectable()
export class CubeApiQueryParamTransformPolicyService implements IQueryParamTransformPolicy {

    public transform(param?: IHistory): {} {

        console.log('transform', param);
        return {};
    }
}
