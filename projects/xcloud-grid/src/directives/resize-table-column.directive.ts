import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

const RESIZABLEFLAG: string = 'resizable';

@Directive({
    selector: '[resizeTableColumn]'
})
export class ResizeTableColumnDirective {

    @Input('resizeTableColumn') public set resizable(val: boolean) {
        this._resizable = val;
        if (val) {
            this.renderer2.addClass(this.el.nativeElement, RESIZABLEFLAG);
        }
    }
    private _resizable: boolean;
    public constructor(
        private el: ElementRef,
        private renderer2: Renderer2
    ) { }

}
