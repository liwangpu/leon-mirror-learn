import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
    selector: '[dynamicStyleWidth]'
})
export class DynamicStyleWidthDirective {

    @Input('dynamicStyleWidth')
    public set dynamicStyleWidth(val: number) {
        if (!val) {
            return;
        }
    }

}
