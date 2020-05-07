import { IFlowProcess } from './i-flow-process';

export interface IFlowProcessDefinition {
    key: string;
    name: string;
    steps?: Array<IFlowProcess>;
}
