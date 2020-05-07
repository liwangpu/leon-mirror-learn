import { IResourceField } from './i-resource-field';

export interface IResourceMetaData {
    key: string;
    title?: string;
    desc?: string;
    fields: Array<IResourceField>;
}
