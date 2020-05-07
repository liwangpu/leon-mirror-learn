import { NgModule } from '@angular/core';
import { TestFormComponent } from './components/test-form/test-form.component';
import { ComponentRegistryService } from './services/component-registry.service';
import { COMPONENTREGISTRY } from 'mirror-deed';
import { TestTabComponent } from './components/test-tab/test-tab.component';
import { SharedModule as MirrorSharedModule } from 'mirror-shared';
import { TestTreeComponent } from './components/test-tree/test-tree.component';

@NgModule({
    declarations: [TestFormComponent, TestTabComponent, TestTreeComponent],
    imports: [
        MirrorSharedModule
    ],
    providers: [
        ComponentRegistryService,
        {
            provide: COMPONENTREGISTRY,
            useExisting: ComponentRegistryService,
            multi: true
        },
    ],
    exports: [],
    entryComponents: [TestFormComponent, TestTreeComponent]
})
export class ComponentSetModule { }
