import { Directive, EventEmitter, HostListener, OnDestroy, Output, Renderer2, Input } from '@angular/core';
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
    public constructor(private renderer2: Renderer2) {
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
        const tableNodeClientRect: DOMRect = this.tableNodeEl.getBoundingClientRect();
        const thNodeClientRect: DOMRect = this.thNodeEl.getBoundingClientRect();
        const snaplineClientRect: DOMRect = this.snapline.getBoundingClientRect();

        let showSnapline = false;
        // console.log('down');
        // 用自定义属性记下表格最原始的宽度
        const resize: (e: any) => void = e => {
            e.stopPropagation();
            // 5补齐padding精度问题
            let thw: number = e.pageX - thNodeClientRect.left + 5;

            // console.log();
            this.renderer2.setStyle(this.snapline, 'left', `${e.pageX - snaplineClientRect.left}px`);
            if (!showSnapline) {
                this.renderer2.setStyle(this.snapline, 'opacity', 1);
                showSnapline = true;
            }
            // 太小了就不调了
            if (Math.abs(thw - thNodeClientRect.width) < 4) {
                thw = thNodeClientRect.width;
            }
            if (thw < thminWidth) {
                thw = thminWidth;
            }
            this.size = thw;
            // console.log('resize', e.pageX, thw);
        };

        window.addEventListener('mousemove', resize);

        const resizeEnd: (e: any) => void = e => {
            e.stopPropagation();
            this.handlerRelease.next();
            window.removeEventListener('mousemove', resize);
            showSnapline = false;
            this.renderer2.setStyle(this.snapline, 'opacity', 0);
            this.renderer2.setStyle(this.snapline, 'left', `0`)
            // console.log('end', this.size);
            if (!this.size || this.size === thNodeClientRect.width) { return; }
            let tableWidth: number = tableNodeClientRect.width + (this.size - thNodeClientRect.width);
            // tslint:disable-next-line: restrict-plus-operands
            this.renderer2.setStyle(this.tableNodeEl, 'width', `${tableWidth}px`);
            this.renderer2.setAttribute(this.tableNodeEl, 'sign-width', `${tableWidth}`);
            this.renderer2.setStyle(this.thNodeEl, 'width', `${this.size}px`);
            this.renderer2.setAttribute(this.thNodeEl, 'sign-width', `${this.size}`);
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
