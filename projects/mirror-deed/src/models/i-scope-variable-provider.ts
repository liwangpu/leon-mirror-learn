export interface IScopeVariableProvider {
    registryGetSuperiorScopeVariable(fn: (key: string) => any): void;
    getVariable(key: string): any;
}
