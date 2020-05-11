export class ArrayTool {

    /**
     * 从数组中移除给定函数返回 false 的元素
     * 返回值是被移除的元素
     * @param arr 数组
     * @param func 移除判断函数
     */
    public static remove<T>(arr: Array<T>, func: (value: T, index?: number, array?: Array<T>) => boolean): T {
        if (arr && Array.isArray(arr)) {
            const removeArr: Array<T> = arr.filter(func).reduce((acc, val) => {
                arr.splice(arr.indexOf(val), 1);
                return acc.concat(val);
            }, []);
            if (removeArr && removeArr.length > 0) {
                return removeArr[0];
            }
        }
        return null;
    }

    public static deepCopy<T = any>(arr: Array<T>): Array<T> {
        if (!arr || arr.length < 1) { return []; }

        let str: string = JSON.stringify(arr);
        return JSON.parse(str);
    }

    public static applyFilterKeepOriginArrayOrder<T = any>(originArr: Array<T>, sourceArr: Array<T>, idField: string, condition: (item: T) => boolean): Array<T> {
        let dest: Array<T> = [];
        originArr.forEach(it => {
            let cur = sourceArr.filter(x => x[idField] === it[idField])[0];
            if (!cur) { return; }
            if (condition(cur)) {
                dest.push(cur);
            }
        });
        sourceArr.filter(x => condition(x)).forEach(it => {
            if (dest.some(x => x[idField] === it[idField])) {
                return;
            }
            dest.push(it);
        });
        return dest;
    }

    /**
     * 返回两个数组之间的差集 (拿来对比数字或者字符串数组)
     * @param a 数组A
     * @param b 数组B
     */
    public static symmetricDifference(a: Array<any>, b: Array<any>): Array<any> {
        const sA: Set<any> = new Set(a);
        const sB: Set<any> = new Set(b);
        return [...a.filter(x => !sB.has(x)), ...b.filter(x => !sA.has(x))];
    }

}
