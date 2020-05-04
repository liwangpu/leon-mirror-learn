import { Component, Input } from '@angular/core';
import { ITableColumn } from '../../models/i-table-column';

@Component({
    selector: 'xcloud-grid-table-header-cell',
    templateUrl: './table-header-cell.component.html',
    styleUrls: ['./table-header-cell.component.scss']
})
export class TableHeaderCellComponent {

    @Input() public column: ITableColumn;

}
