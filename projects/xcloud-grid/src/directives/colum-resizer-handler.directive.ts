import { Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output, Renderer2, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
    selector: '[columResizerHandler]'
})
export class ColumResizerHandlerDirective implements OnDestroy {

    @Input('columResizerHandler') public tableCell: Element;
    @Output() public readonly afterResize: EventEmitter<number> = new EventEmitter<number>();

    private handlerRelease: Subject<void> = new Subject<void>();
    private resizeEnd: any;
    private size: number = 0;
    public constructor(private el: ElementRef, private renderer2: Renderer2) {
        this.handlerRelease.subscribe(() => {
            window.removeEventListener('mouseup', this.resizeEnd);
        });
    }
    @HostListener('click', ['$event']) public onClick(e: any): void {
        e.stopPropagation();
    }

    @HostListener('mousedown', ['$event']) public onMouseDown(evt: any): void {
        // console.log(1, this.tableCell.parentElement);
        evt.stopPropagation();
        const thminWidth: number = 100;
        const thNodeEl: any = this.tableCell;
        const trNodeEl: any = thNodeEl.parentElement;
        const tableNodeEl: any = trNodeEl.parentElement.parentElement;
        const tableNodeClientRect: any = tableNodeEl.getBoundingClientRect();
        const thNodeClientRect: any = thNodeEl.getBoundingClientRect();
        // 用自定义属性记下表格最原始的宽度

        const resize: (e: any) => void = e => {
            let thw: number = e.pageX - thNodeClientRect.left;
            if (thw < thminWidth) {
                thw = thminWidth;
            }
            // tslint:disable-next-line: restrict-plus-operands
            this.renderer2.setStyle(tableNodeEl, 'width', `${tableNodeClientRect.width + (thw - thNodeClientRect.width)}px`);
            this.renderer2.setStyle(thNodeEl, 'width', `${thw}px`);
            this.size = thw;
        };

        window.addEventListener('mousemove', resize);

        const resizeEnd: (e: any) => void = e => {
            e.stopPropagation();
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
