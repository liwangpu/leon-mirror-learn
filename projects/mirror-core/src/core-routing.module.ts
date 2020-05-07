import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicPageComponent } from './components/dynamic-page/dynamic-page.component';
import { PageMetaDataResolverService } from './services/page-meta-data-resolver.service';

const routes: Routes = [
    {
        path: 'dynamic/:metaKey',
        component: DynamicPageComponent,
        resolve: {
            pageMetaData: PageMetaDataResolverService
        }
    },
    {
        path: 'dynamic/:metaKey/:dataId',
        component: DynamicPageComponent,
        resolve: {
            pageMetaData: PageMetaDataResolverService
        }
    }
];

@NgModule({
    declarations: [
        DynamicPageComponent
    ],
    imports: [RouterModule.forChild(routes)],
    providers:[
        PageMetaDataResolverService
    ],
    exports: [RouterModule]
})
export class CoreRoutingModule { }
