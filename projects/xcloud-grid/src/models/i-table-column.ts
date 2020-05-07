import { ColumnTypeEnum } from '../enums/column-type-enum.enum';

export interface ITableColumn {
    name: string;
    field: string;
    sort?: boolean;
    sortField?: string;
    fieldType?: ColumnTypeEnum;
    reference?: string;
    width?: number;
    frozen?: boolean;
    link?: true;
}
