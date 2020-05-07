export class ObjectTool {

    public static deepCopy<T = any>(obj: T): T {
        if (!obj) { return obj; }

        let str: string = JSON.stringify(obj);
        return JSON.parse(str);
    }

    /**
     * 根据字段把原数据相应字段取出来
     * @param obj 原数据
     * @param fields 只能为单个字段的数组
     */
    public static recursionValueByFields(obj: any, fields: Array<string>): any {
        if (!obj || !fields || !fields.length) { return undefined; }
        if (fields.length === 1) { return obj[fields[0]]; }
        return fields.reduce((r, f, idx) => idx == 1 ? (obj[r] ? obj[r][f] : undefined) : (r ? r[f] : undefined));
    }

    /**
     * 根据字段把原数据相应字段取出来
     * @param obj 原数据
     * @param field 可以为单个字段,还支持嵌套的.
     */
    public static recursionValueByField(obj: any, field: string): any {
        if (!obj || !field) { return undefined; }
        let fields: Array<string> = field.split('.');
        return ObjectTool.recursionValueByFields(obj, fields);
    }

    /**
     * 根据map把原数据改为相应的格式
     * @param obj 原数据
     * @param map map
     */
    public static transformByMap(obj: any, map: { [key: string]: string } | string): any {
        if (!obj) { return undefined; }
        if (!map) { return obj; }
        if (typeof map === 'string') {
            return obj[map];
        }
        let data: any = {};
        let keys: Array<string> = Object.keys(map);
        if (!keys.length) { return obj; }

        for (let k of keys) {
            // console.log(1, obj, k, map[k]);
            data[k] = ObjectTool.recursionValueByField(obj, map[k]);
        }
        return data;
    }
}
