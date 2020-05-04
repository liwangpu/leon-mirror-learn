import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreRoutingModule as MirrorCoreRoutingModule } from 'mirror-core';

const routes: Routes = [
    {
        path: 'grid-demo',
        loadChildren: () => import('./grid-demo/grid-demo.module').then(m => m.GridDemoModule)
    },
    { path: '**', redirectTo: 'grid-demo' }
];

@NgModule({
    imports: [MirrorCoreRoutingModule, RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
