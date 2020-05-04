import { NgModule } from '@angular/core';
import { ComponentRegistryService } from './services/component-registry.service';
import { COMPONENTREGISTRY } from 'mirror-deed';
import { FlexRowLayoutComponent } from './components/flex-row-layout/flex-row-layout.component';
import { BlankLayoutComponent } from './components/blank-layout/blank-layout.component';

@NgModule({
    declarations: [BlankLayoutComponent, FlexRowLayoutComponent],
    imports: [
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
    entryComponents: [BlankLayoutComponent, FlexRowLayoutComponent]
})
export class ComponentLayoutModule { }
