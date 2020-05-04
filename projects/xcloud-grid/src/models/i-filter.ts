export interface IFilter {
    field: string;
    operator: string;
    value: any;
    buildIn?: boolean;
    or?: boolean;
    orGroup?: string;
}
