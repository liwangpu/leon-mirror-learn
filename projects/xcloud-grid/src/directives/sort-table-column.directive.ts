import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, HostBinding } from '@angular/core';
import { ISortEvent } from '../models/i-sort-event';
import { ITableColumn } from '../models/i-table-column';

const ASCENDINGFLAG: string = 'asc';
const DESCENDINGFLAG: string = 'desc';

@Directive({
    selector: '[sortTableColumn]'
})
export class SortTableColumnDirective {

    @Input('sortTableColumn') public set column(col: ITableColumn) {
        this._column = col;
        if (col && col.sort) {
            this.renderer2.addClass(this.el.nativeElement, 'sortable');
            this.columnField = this.column.sortField ? this.column.sortField : this.column.field;
        }

        if (col['sorting_order']) {
            if (col['sorting_order'] === ASCENDINGFLAG) {
                this.markAsc();
            } else {
                this.markDesc();
            }
        }
    }
    public get column(): ITableColumn {
        return this._column;
    }
    @HostBinding('attr.sort') public sortIndicator: string;
    @Output() public readonly sort: EventEmitter<ISortEvent> = new EventEmitter<ISortEvent>();
    public columnField: string;
    private _column: ITableColumn;
    private direction: string;
    public constructor(
        private el: ElementRef,
        private renderer2: Renderer2
    ) { }
    @HostListener('click', ['$event']) public onClick(e): void {
        e.stopPropagation();
        if (!this.column || !this.column.sort) { return; }

        if (this.direction === ASCENDINGFLAG) {
            this.markDesc();
        } else if (this.direction === DESCENDINGFLAG) {
            this.clearSort();
        } else {
            this.markAsc();
        }

        this.sort.next({ field: this.columnField, direction: this.direction });
    }

    public clearSort(): void {
        this.direction = '';
        this.sortIndicator = '';
    }
    private markAsc(): void {
        this.direction = ASCENDINGFLAG;
        this.sortIndicator = ASCENDINGFLAG;
    }

    private markDesc(): void {
        this.direction = DESCENDINGFLAG;
        this.sortIndicator = DESCENDINGFLAG;
    }

}
