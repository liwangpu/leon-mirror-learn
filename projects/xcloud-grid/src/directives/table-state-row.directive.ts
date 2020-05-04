import { Directive, Input, HostListener } from '@angular/core';
import { ITableColumn } from '../models/i-table-column';

@Directive({
    selector: '[tableStateRow]'
})
export class TableStateRowDirective {

    @Input('tableStateRow') public row: ITableColumn;
    @HostListener('mouseenter', ['$event']) public onMouseEnter(e: any): void {
        this.row['_active'] = true;
    }
    @HostListener('mouseleave', ['$event']) public onMouseLeave(e: any): void {
        this.row['_active'] = false;
    }
    constructor() { }

}
