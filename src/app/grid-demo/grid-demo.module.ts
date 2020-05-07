import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridDemoRoutingModule } from './grid-demo-routing.module';
import { StudentListComponent } from './components/student-list/student-list.component';
import { GridModule, GRIDCONFIG, QUERYPARAMTRANSFORMPOLICY } from 'xcloud-grid';
import { CubeApiQueryParamTransformPolicyService } from './services/cube-api-query-param-transform-policy.service';


@NgModule({
  declarations: [StudentListComponent],
  imports: [
    CommonModule,
    GridDemoRoutingModule,
    GridModule
  ],
  providers:[
    CubeApiQueryParamTransformPolicyService,
    {
        provide: GRIDCONFIG,
        useValue: {
            rowsPerPageOptions: [20, 50, 100]
        }
    },
    {
        provide: QUERYPARAMTRANSFORMPOLICY,
        useExisting: CubeApiQueryParamTransformPolicyService
    },
  ]
})
export class GridDemoModule { }
