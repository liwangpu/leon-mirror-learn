import { IScopeVariableProvider } from './i-scope-variable-provider';
import { INotification } from './i-notification';

export interface IDynamicComponent extends IScopeVariableProvider {
    readonly componentId: string;
    readonly notify: Array<INotification>;
    readonly subscribe: Array<INotification>;
    // afterRenderer(): Promise<void>;
    // destroy(): Promise<void>
}
