export class UrlTool {

    /**
     * 获取url中的path和查询部分
     * 例如从 http://localhost:80080/home?name=test中获取到/home?name=test
     * @param url url
     */
    public static getPathAndQuery(url: string): string {
        if (!url) {
            return '/';
        }

        let t1: string = url.replace('http://', '').replace('http:/', '').replace('https://', '').replace('http:/', '');

        let i1: number = t1.indexOf('/');
        return t1.slice(i1);
    }

    /**
     * 获取url中的path部分
     * 例如从 http://localhost:80080/home?name=test中获取到/home
     * @param url url
     */
    public static getPath(url: string): string {
        let t1: string = UrlTool.getPathAndQuery(url);
        let i1: number = t1.indexOf('?');
        return i1 > -1 ? t1.slice(0, i1) : t1;
    }

    /**
     * 获取URL中非查询部分
     * 例如从 http://localhost:80080/home?name=test中获取到http://localhost:80080/home
     * @param url url
     */
    public static getURLExcludeQuery(url: string): string {
        if (!url) {
            return null;
        }

        const i: number = url.indexOf('?');
        return i > -1 ? url.slice(0, i) : url;
    }

    /**
     * 获取浏览器Root URL
     */
    public static getRootURL(): string {
        if (typeof location === 'undefined') {
            return null;
        }
        // tslint:disable-next-line: prefer-template
        return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    }

    /**
     * 获取浏览器顶级域名
     * TLD: top-level domain name
     */
    public static getTLD(): string {
        if (typeof location === 'undefined') {
            return null;
        }
        let url: string = location.hostname;
        let urlArr: Array<string> = url.split('.');
        if (urlArr.length <= 2) {
            return url;
        }
        return `${urlArr[urlArr.length - 2]}.${urlArr[urlArr.length - 1]}`;
    }
}
