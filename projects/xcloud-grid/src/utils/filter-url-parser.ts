import { EQ_OPERATOR } from '../consts/filter-operators';
import { IFilter } from '../models/i-filter';

export class FilterUrlParser {
    public static stringify(filters: Array<IFilter>): string {
        if (!filters || filters.length < 1) {
            return null;
        }

        let fs: Array<any> = [];
        for (let filter of filters) {
            fs.push(filter.field);
            fs.push(filter.operator === EQ_OPERATOR ? '' : filter.operator);
            fs.push(filter.value);
        }

        return encodeURI(JSON.stringify(fs));

    }

    public static parser(filterQuery: string): Array<IFilter> {
        if (!filterQuery || filterQuery.trim() === '') {
            return null;
        }

        let filters: Array<IFilter> = [];
        let fs: Array<any> = JSON.parse(decodeURI(filterQuery));
        for (let i: number = 0, len: number = fs.length - 1; i < len; i += 3) {
            filters.push({ field: fs[0], operator: !fs[1] ? EQ_OPERATOR : fs[1], value: fs[2] });
        }
        return filters;
    }
}
