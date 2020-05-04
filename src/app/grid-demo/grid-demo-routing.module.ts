import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';


const routes: Routes = [
    {
        path: 'student_list',
        component: StudentListComponent
    },
    { path: '**', redirectTo: 'student_list' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GridDemoRoutingModule { }
