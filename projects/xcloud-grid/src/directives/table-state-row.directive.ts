import { Directive, Input, HostListener } from '@angular/core';
import { ITableColumn } from '../models/i-table-column';

@Directive({
    selector: '[tableStateRow]'
})
export class TableStateRowDirective {

    @Input('tableStateRow') public row: ITableColumn;
    @Input() public enableRowState: boolean;
    @HostListener('mouseenter', ['$event']) public onMouseEnter(e: any): void {
        e.stopPropagation();
        if (!this.enableRowState) {
            this.row['_active'] = false;
            return;
        }
        this.row['_active'] = true;
    }
    @HostListener('mouseleave', ['$event']) public onMouseLeave(e: any): void {
        e.stopPropagation();
        this.row['_active'] = false;
    }
    constructor() { }

}
