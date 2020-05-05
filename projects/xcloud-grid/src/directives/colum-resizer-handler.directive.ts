import { Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output, Renderer2, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
    selector: '[columResizerHandler]'
})
export class ColumResizerHandlerDirective implements OnDestroy {

    @Input('columResizerHandler') public tableCell: Element;
    @Input() public snapline: Element;
    @Output() public readonly afterResize: EventEmitter<number> = new EventEmitter<number>();
    private handlerRelease: Subject<void> = new Subject<void>();
    private resizeEnd: any;
    private size: number = 0;
    private thNodeEl: Element;
    private tableNodeEl: Element;
    public constructor(private el: ElementRef, private renderer2: Renderer2) {
        this.handlerRelease.subscribe(() => {
            window.removeEventListener('mouseup', this.resizeEnd);
        });
    }

    @HostListener('click', ['$event']) public onClick(e: any): void {
        e.stopPropagation();
    }

    @HostListener('mousedown', ['$event']) public onMouseDown(evt: any): void {
        evt.stopPropagation();
        const thminWidth: number = 100;
        if (!this.thNodeEl) {
            this.thNodeEl = this.tableCell;
            const trNodeEl: any = this.thNodeEl.parentElement;
            this.tableNodeEl = trNodeEl.parentElement.parentElement;
        }
        const tableNodeClientRect: any = this.tableNodeEl.getBoundingClientRect();
        const thNodeClientRect: any = this.thNodeEl.getBoundingClientRect();
        const snaplineClientRect: any = this.snapline.getBoundingClientRect();

        let showSnapline = false;
        // 用自定义属性记下表格最原始的宽度
        const resize: (e: any) => void = e => {
            e.stopPropagation();
            let thw: number = e.pageX - thNodeClientRect.left;
            this.renderer2.setStyle(this.snapline, 'left', `${e.pageX - snaplineClientRect.left}px`);
            if (!showSnapline) {
                this.renderer2.setStyle(this.snapline, 'opacity', 1);
                showSnapline = true;
            }
            if (thw < thminWidth) {
                thw = thminWidth;
            }
            this.size = thw;
        };

        window.addEventListener('mousemove', resize);

        const resizeEnd: (e: any) => void = e => {
            e.stopPropagation();
            // tslint:disable-next-line: restrict-plus-operands
            this.renderer2.setStyle(this.tableNodeEl, 'width', `${tableNodeClientRect.width + (this.size - thNodeClientRect.width)}px`);
            this.renderer2.setStyle(this.thNodeEl, 'width', `${this.size}px`);
            showSnapline = true;
            this.renderer2.setStyle(this.snapline, 'opacity', 0);
            this.renderer2.setStyle(this.snapline, 'left', `0`)    
            window.removeEventListener('mousemove', resize);
            this.handlerRelease.next();
            this.afterResize.next(this.size);
        };

        this.resizeEnd = resizeEnd;

        window.addEventListener('mouseup', resizeEnd);
    }

    public ngOnDestroy(): void {
        this.handlerRelease.complete();
        this.handlerRelease.unsubscribe();
    }

}
