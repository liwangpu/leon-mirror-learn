import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DycMessageEmitterPanelComponent } from './components/dyc-message-emitter-panel/dyc-message-emitter-panel.component';
import { DycMessageDisplayPanelComponent } from './components/dyc-message-display-panel/dyc-message-display-panel.component';


@NgModule({
    declarations: [DycMessageEmitterPanelComponent, DycMessageDisplayPanelComponent],
    imports: [
        ReactiveFormsModule
    ],
    exports: [DycMessageEmitterPanelComponent, DycMessageDisplayPanelComponent]
})
export class SharedModule { }
