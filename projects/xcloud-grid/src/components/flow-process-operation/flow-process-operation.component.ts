import { Component, Input } from '@angular/core';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { GridOpsatService } from '../../services/grid-opsat.service';

@Component({
    selector: 'xcloud-grid-flow-process-operation',
    templateUrl: './flow-process-operation.component.html',
    styleUrls: ['./flow-process-operation.component.scss']
})
export class FlowProcessOperationComponent {

    @Input()
    public processKey: string;
    @Input()
    public id: string;
    @Input()
    public key: string;
    @Input()
    public name: string;
    @Input()
    public formKey: string;
    @Input()
    public variables: any;
    public constructor(
        private opsat: GridOpsatService
    ) { }

    public executeProcess(): void {
        // console.log('form key', this.key);
        this.opsat.publish(GridTopicEnum.FlowProcessEdit, { name: this.name, processKey: this.processKey, taskKey: this.key, dataId: this.id, formKey: this.formKey });
    }

}
