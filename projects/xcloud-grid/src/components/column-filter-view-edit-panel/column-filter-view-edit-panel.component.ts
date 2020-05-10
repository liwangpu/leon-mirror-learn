import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
        @Inject(DIALOG_DATA) private viewName?: string,
    ) {
        this.editForm = this.fb.group({
            name: ['', [Validators.required]]
        });
    }

    public ngOnInit(): void {
        if (this.viewName) {
            this.editForm.patchValue({ name: this.viewName });
        }
    }

    public save(): void {
        let data: { name: string } = this.editForm.value;
        this.ref.close(data.name);
    }

}
