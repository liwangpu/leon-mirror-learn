import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridTopicEnum } from '../../enums/grid-topic.enum';
import { IFilterView } from '../../models/i-filter-view';
import { GridOpsatService } from '../../services/grid-opsat.service';
import { DynamicDialogRef, DIALOG_DATA } from '@byzan/orion2';

@Component({
    selector: 'xcloud-grid-column-filter-view-edit-panel',
    templateUrl: './column-filter-view-edit-panel.component.html',
    styleUrls: ['./column-filter-view-edit-panel.component.scss']
})
export class ColumnFilterViewEditPanelComponent implements OnInit {

    public editForm: FormGroup;

    public constructor(
        public ref: DynamicDialogRef<ColumnFilterViewEditPanelComponent>,
        private fb: FormBuilder,
        @Inject(DIALOG_DATA) private data?: any,
    ) {
        this.editForm = this.fb.group({
            name: ['', [Validators.required]]
        });
    }

    public ngOnInit(): void {
        // this.editForm.patchValue({ name: this.config.data.id ? this.config.data.name : '' });
    }

    public save(): void {
        // let view: IFilterView = this.config.data as IFilterView;
        // view.name = this.editForm.value.name;
        // this.opsat.publish(GridTopicEnum.FilterViewCreateOrUpdate, view);
        // this.ref.close(true);
    }

}
