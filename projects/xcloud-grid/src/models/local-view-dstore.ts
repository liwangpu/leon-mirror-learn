import { Observable, of } from 'rxjs';
import { UrlTool } from '../utils/url-tool';
import { DStore } from './dstore';
import { IFilterView } from './i-filter-view';
import { v4 as uuidv4 } from 'uuid';
import { ObjectTool } from '../utils/object-tool';
export abstract class LocalViewDStore extends DStore {

    private pageKey: string;
    private filterViews: Array<IFilterView> = [];
    public constructor() {
        super();
        if (location) {
            this.pageKey = UrlTool.getPath(location.href);
        }
        this.filterViews = this.getTemporyViewInLocalStorage();
        console.log('views', this.filterViews);
    }

    public async getFilterViews(): Promise<Array<IFilterView>> {
        return ObjectTool.deepCopy(this.filterViews);
    }

    public async onFilterViewCreate(view: IFilterView): Promise<IFilterView> {
        console.log('view create 1', this.filterViews);
        view.id = uuidv4();
        // view.id = 'ttt';

        // this.filterViews.push(ObjectTool.deepCopy(view));
        // this.temporaryStoreViewToLocalStorage();

        return view;
    }

    public async onFilterViewUpdate(view: IFilterView): Promise<void> {
        let index: number = this.filterViews.findIndex(x => x.id);
        if (index > -1) {
            this.filterViews[index] = ObjectTool.deepCopy(view);
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
