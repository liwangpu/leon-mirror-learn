import { IDynamicComponent } from './i-dynamic-component';
import { ViewContainerRef, Injector, ComponentRef } from '@angular/core';
import { IComponentMetaData, COMPONENTMETADATA } from './i-component-meta-data';
import { IComponentDiscovery, COMPONENTDISCOVERY } from '../tokens/component-discovery';
import { IComponentDesignDataStore, COMPONENTDESIGNDATASTORE } from '../tokens/component-design-data-store';
import { DynamicComponentEventEnum } from '../enums/dynamic-component-event.enum';
import { v4 as uuidv4 } from 'uuid';
import { IDynamicComponentOpsat, DYNAMICCOMPONENTOPSAT } from '../tokens/dynamic-component-opsat';
import { IDynamicComponentRecorder, DYNAMICCOMPONENTRECORDER } from '../tokens/dynamic-component-recorder';
import { INotification } from './i-notification';


export function DynamicContainer(containerId?: string) {
    containerId = containerId || '';
    return function (target: Object, propertyName: string) {
        let _val = null;
        function setter(val: any) {
            <DynamicComponent>this.container.set(containerId, val);
            _val = val;
        }

        function getter() {
            return _val;
        }

        Object.defineProperty(target, propertyName, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}

export abstract class DynamicComponent implements IDynamicComponent {

    public readonly componentId: string;
    public get title(): string {
        return this.metaData?.title;
    }
    public get notify(): Array<INotification> {
        return this.metaData?.notify || [];
    }
    public get subscribe(): Array<INotification> {
        return this.metaData?.subscribe || [];
    }
    protected metaData: IComponentMetaData;
    protected container = new Map<string, ViewContainerRef>();
    private variableScope: { [key: string]: any } = {}; // 组件变量作用域,为了保证作用域安全,通过setVariable/getVariable操作
    private opsat: IDynamicComponentOpsat;
    private recorder: IDynamicComponentRecorder;
    private getSuperiorScopeVariable: (key: string) => any;
    public constructor(
        protected injector: Injector
    ) {
        this.componentId = uuidv4();
        this.opsat = this.injector.get(DYNAMICCOMPONENTOPSAT);
        this.recorder = this.injector.get(DYNAMICCOMPONENTRECORDER);
        // console.log('uuid', this.componentId);
    }
    // public getSuperiorScopeVariable: (key: string) => any;
    public registryGetSuperiorScopeVariable(fn: (key: string) => any): void {
        this.getSuperiorScopeVariable = fn;
    }

    public getVariable(key: string): void {
        if (!key) {
            console.warn(`你在获取一个key为空的variable scope,返回值可能不是你想要的`);
            return null;
        }
        let value: any = this.variableScope[key];
        if (!value && this.getSuperiorScopeVariable) {
            value = this.getSuperiorScopeVariable(key);
        }
        return value;
    }

    protected abstract async afterRenderer(): Promise<void>;
    protected abstract async onReceiveMessage(topic: string, data?: any): Promise<void>;
    protected abstract async initialize(value?: any): Promise<void>;
    protected async startup(): Promise<void> {
        if (!this.metaData) {
            this.metaData = this.injector.get(COMPONENTMETADATA, {});
        }
        const componentDiscoverySrv: IComponentDiscovery = this.injector.get(COMPONENTDISCOVERY);
        const componentDesignDataStore: IComponentDesignDataStore = this.injector.get(COMPONENTDESIGNDATASTORE);
        if (this.metaData.key) {
            let m = await componentDesignDataStore.getMetaData(this.metaData.key).toPromise();
            this.metaData = { ...this.metaData, ...m };
        }

        for (let idx: number = 0, len: number = this.metaData.content?.length || 0; idx < len; idx++) {
            let it = this.metaData.content[idx];
            if (it.key) {
                let m = await componentDesignDataStore.getMetaData(it.key).toPromise();
                this.metaData.content[idx] = { ...it, ...m };
            }
            let fac = componentDiscoverySrv.generateComponentFactory(this.metaData.content[idx].control);
            if (!fac) {
                console.error(`组件库里面没有找到control为${this.metaData.content[idx].control}的组件,请检查是否注册或者写错`);
                continue;
            }

            const ij = Injector.create([
                {
                    provide: COMPONENTMETADATA,
                    useValue: it
                }
            ], this.injector);
            let containerId: string = this.metaData.content[idx].containerId || '';
            let vc = this.container.get(containerId);
            if (!vc) {
                console.error(`没有找到containerId为 "${containerId}" 的ViewContainerRef,请检查containerId是否写错或者动态组件宿主是否已经提供该Ref`)
                continue;
            }
            let dyc: ComponentRef<IDynamicComponent> = vc.createComponent(fac, null, ij);
            // 修改afterRenderer属性,在调用前先调用recorder记录下动态生成的组件
            const originAfterRenderer = dyc.instance['afterRenderer'];
            const parentId = this.componentId;
            Object.defineProperty(dyc.instance, 'afterRenderer', {
                value: function () {
                    this.recorder.recordDynamicComponent(dyc.instance, parentId);
                    originAfterRenderer.apply(this);
                }
            });
            dyc.instance.registryGetSuperiorScopeVariable(key => this.getVariable(key));
        }
        this.afterRenderer();
    }

    protected async destroy(): Promise<void> {
        this.recorder.recordDynamicComponentDestroy(this.componentId);
        console.log(`${this.componentId} destroy`);
    }

    protected setVariable(key: string, value?: any): void {
        if (!key) {
            console.warn(`你在设置一个key为空的variable scope,该设置不会生效`);
            return;
        }

        // 重复值不发送事件
        if (this.variableScope[key] !== value) {
            this.publishMessage(DynamicComponentEventEnum.valueChange, { name: key, value: value });
        }
        this.variableScope[key] = value;
    }

    protected setVariables(data: any): void {
        if (!data) {
            console.warn(`你在设置一个data为空的variable scope,该设置不会生效`);
            return;
        }
        let keys: Array<string> = Object.keys(data);
        for (let k of keys) {
            this.setVariable(k, data[k]);
        }
    }

    protected getVariables(): any {
        return this.variableScope;
    }

    protected publishMessage(topic: string, data?: any): void {
        if (!this.opsat) { return; }

        this.opsat.publish(topic, this.componentId, data);
    }
}
