import { IComponentMetaData } from './i-component-meta-data';

export interface IPageMetaData {
    key: string;
    title?: string;
    layout: IComponentMetaData;
}
