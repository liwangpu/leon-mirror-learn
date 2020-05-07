import { Component } from '@angular/core';
import { DynamicComponent } from 'mirror-deed';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'mirror-shared-dyc-message-emitter-panel',
    templateUrl: './dyc-message-emitter-panel.component.html',
    styleUrls: ['./dyc-message-emitter-panel.component.scss']
})
export class DycMessageEmitterPanelComponent {

    public form: FormGroup;
    public constructor(
        private dyc: DynamicComponent,
        fb: FormBuilder
    ) {
        this.form = fb.group({
            topic: ['valueChange', [Validators.required]],
            name: ['id'],
            value: ['aaaa'],
        });
    }

    public send(): void {
        let data: { topic: string; name: string, value: string } = this.form.value;
        this.dyc['publishMessage'](data.topic, { name: data.name, value: data.value });
    }

}
