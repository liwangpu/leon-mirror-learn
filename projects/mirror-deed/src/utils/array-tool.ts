export class ArrayTool {

    /**
     * 从数组中移除给定函数返回 false 的元素
     * 返回值是被移除的元素
     * @param arr 数组
     * @param func 移除判断函数
     */
    public static remove<T>(arr: Array<T>, func: (value: T, index?: number, array?: Array<T>) => boolean): Array<T> {
        if (arr && Array.isArray(arr)) {
            const removeArr: Array<T> = arr.filter(func).reduce((acc, val) => {
                arr.splice(arr.indexOf(val), 1);
                return acc.concat(val);
            }, []);
            return removeArr;
        }
        return [];
    }

    public static deepCopy<T = any>(arr: Array<T>): Array<T> {
        if (!arr || arr.length < 1) { return []; }

        let str: string = JSON.stringify(arr);
        return JSON.parse(str);
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

    public static sort<T = any>(list: Array<T>, fun: (value: T) => string): Array<T> {
        if (list === undefined || list === null) { return []; }
        list.sort((a, b) => {
            let strA: string = fun(a);
            let strB: string = fun(b);
            // 谁为非法值谁在前面
            // tslint:disable-next-line: prefer-switch
            if (strA === undefined || strA === null || strA === '' || strA === ' ' || strA === ' ') {
                return -1;
            }
            // tslint:disable-next-line: prefer-switch
            if (strB === undefined || strB === null || strB === '' || strB === ' ' || strB === ' ') {
                return 1;
            }
            // 如果a和b中全部都是汉字，或者全部都非汉字
            if ((strA.split('').every(char => ArrayTool.notChinese(char)) && strB.split('').every(char => ArrayTool.notChinese(char))) ||
                (strA.split('').every(char => !ArrayTool.notChinese(char)) && strB.split('').every(char => !ArrayTool.notChinese(char)))) {
                return strA.localeCompare(strB);
            } else {
                const charAry: Array<string> = strA.split('');
                // tslint:disable-next-line: no-for-in-array
                for (const i in charAry) {
                    if ((ArrayTool.charCompare(strA[i], strB[i]) !== 0)) {
                        return ArrayTool.charCompare(strA[i], strB[i]);
                    }
                }
                // 如果通过上面的循环对比还比不出来，就无解了，直接返回-1
                return -1;
            }
        });
        return list;
    }

    private static charCompare(charA: string, charB: string): number {
        // 谁为非法值谁在前面
        // tslint:disable-next-line: prefer-switch
        if (charA === undefined || charA === null || charA === '' || charA === ' ' || charA === ' ') {
            return -1;
        }
        // tslint:disable-next-line: prefer-switch
        if (charB === undefined || charB === null || charB === '' || charB === ' ' || charB === ' ') {
            return 1;
        }
        // 如果都为英文或者都为汉字则直接对比
        if ((ArrayTool.notChinese(charA) && ArrayTool.notChinese(charB)) || (!ArrayTool.notChinese(charA) && !ArrayTool.notChinese(charB))) {
            return charA.localeCompare(charB);
        } else {
            // 如果不都为英文或者汉字，就肯定有一个是英文，如果a是英文，返回-1，a在前，否则就是b是英文，b在前
            if (ArrayTool.notChinese(charA)) {
                return -1;
            } else {
                return 1;
            }
        }
    }

    private static notChinese(char: string): boolean {
        const charCode: number = char.charCodeAt(0);
        return charCode >= 0 && charCode <= 128;
    }

}
