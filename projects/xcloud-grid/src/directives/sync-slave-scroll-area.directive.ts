import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[syncSlaveScrollArea]'
})
export class SyncSlaveScrollAreaDirective {
    public constructor(public template: TemplateRef<any>) { }
}
