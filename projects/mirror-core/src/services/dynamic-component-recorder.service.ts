import { Injectable, Inject } from '@angular/core';
import { IDynamicComponentRecorder, IDynamicComponent, DYNAMICCOMPONENTOPSAT, IDynamicComponentOpsat, ArrayTool, DynamicComponentEventEnum, IDycMessage } from 'mirror-deed';

@Injectable()
export class DynamicComponentRecorderService implements IDynamicComponentRecorder {

    private dynamicComponents: Array<{ componentId: string; parentId: string; dyc: IDynamicComponent }> = [];
    public constructor(
        @Inject(DYNAMICCOMPONENTOPSAT) private opsat: IDynamicComponentOpsat
    ) {

        let publishValueChaneToChildrenComponent = (parentId: string, data?: { [key: string]: any }) => {
            const children = this.dynamicComponents.filter(x => x.parentId === parentId && x.dyc.subscribe.some(s => s.source === data.name));
            for (let c of children) {
                c.dyc['onReceiveMessage'](DynamicComponentEventEnum.valueChange, data);
                publishValueChaneToChildrenComponent(c.componentId, data);
            }
        }

        this.opsat.message.subscribe(ms => {
            // console.log('mes', ms);
            let { topic, from, data } = ms;
            if (topic === DynamicComponentEventEnum.valueChange) {
                if (!data || typeof data != 'object' || !('name' in data)) {
                    console.warn(`组件发送的valueChange格式不规范,因为它的data数据里面不遵循{name:string;value?:any}格式,该data信息如下`, data);
                    return;
                }
                publishValueChaneToChildrenComponent(from, data);
                return;
            }
        });
    }

    public recordDynamicComponent(dyc: IDynamicComponent, parentId: string): void {
        this.dynamicComponents.push({ componentId: dyc.componentId, parentId, dyc });
        // console.log('dyc', this.dynamicComponents);
    }

    public recordDynamicComponentDestroy(componentId: string): void {
        ArrayTool.remove(this.dynamicComponents, it => it.componentId === componentId);
    }

}
