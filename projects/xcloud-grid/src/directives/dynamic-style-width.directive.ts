import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[dynamicStyleWidth]'
})
export class DynamicStyleWidthDirective {

    @Input('dynamicStyleWidth') public set dynamicStyleWidth(val: number) {
        if (!val) {
            return;
        }
        this.renderer2.setStyle(this.el.nativeElement, 'width', `${val}px`);
        this.renderer2.setAttribute(this.el.nativeElement, 'sign-width', `${val}`);
    }
    public constructor(
        private el: ElementRef,
        private renderer2: Renderer2
    ) { }

}
