import { Observable, of } from 'rxjs';
import { UrlTool } from '../utils/url-tool';
import { DStore } from './dstore';
import { IFilterView } from './i-filter-view';

export abstract class LocalViewDStore extends DStore {

    private pageKey: string;
    private filterViews: Array<IFilterView> = [];
    public constructor() {
        super();
        if (location) {
            this.pageKey = UrlTool.getPath(location.href);
        }
        this.filterViews = this.getTemporyViewInLocalStorage();
    }

    public async getFilterViews(): Promise<Array<IFilterView>> {
        return this.filterViews;

        return new Promise(res => {
            setTimeout(() => {
                res(this.filterViews);
            }, 3000);
        });
    }

    public async onFilterViewCreate(view: IFilterView): Promise<IFilterView> {
        view.id = Date.now().toString();
        this.filterViews.push(view);
        this.temporaryStoreViewToLocalStorage();
        console.log('view create', view);
        return view;
    }

    public async onFilterViewUpdate(view: IFilterView): Promise<void> {
        let index: number = this.filterViews.findIndex(x => x.id);
        if (index > -1) {
            this.filterViews[index] = view;
        }
        this.temporaryStoreViewToLocalStorage();
        console.log('view update', view);
    }

    protected temporaryStoreViewToLocalStorage(): void {
        localStorage.setItem(`${this.pageKey}@ListViews`, JSON.stringify(this.filterViews));
    }

    protected getTemporyViewInLocalStorage(): Array<IFilterView> {
        const viewsStr: string = localStorage.getItem(`${this.pageKey}@ListViews`);
        let views: Array<IFilterView> = JSON.parse(viewsStr);
        return views && views.length > 0 ? views : [];
    }
}
