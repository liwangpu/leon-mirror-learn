import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[syncMasterScrollArea]'
})
export class SyncMasterScrollAreaDirective {
    public constructor(public template: TemplateRef<any>) { }
}
