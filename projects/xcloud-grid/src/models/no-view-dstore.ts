import { DStore } from './dstore';
import { IFilterView } from './i-filter-view';

export abstract class NoViewDStore extends DStore {
    public constructor() {
        super();
    }

    public async getFilterViews(): Promise<Array<IFilterView>> {
        return [];
    }
    public async onFilterViewCreate(view: IFilterView): Promise<IFilterView> {
        return null;
    }
    public async onFilterViewUpdate(view: IFilterView): Promise<void> {

    }

}
