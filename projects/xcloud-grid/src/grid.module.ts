import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ColumnFilterPanelComponent } from './components/column-filter-panel/column-filter-panel.component';
import { ColumnFilterViewEditPanelComponent } from './components/column-filter-view-edit-panel/column-filter-view-edit-panel.component';
import { ColumnVisualEditingPanelComponent } from './components/column-visual-editing-panel/column-visual-editing-panel.component';
import { FilterItemBoxComponent } from './components/filter-item-box/filter-item-box.component';
import { FilterItemSettingPanelComponent } from './components/filter-item-setting-panel/filter-item-setting-panel.component';
import { FrozenTableComponent } from './components/frozen-table/frozen-table.component';
import { GridContentComponent } from './components/grid-content/grid-content.component';
import { GridFooterComponent } from './components/grid-footer/grid-footer.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { GridComponent } from './components/grid/grid.component';
import { OperationTableComponent } from './components/operation-table/operation-table.component';
import { SyncScrollPanelComponent } from './components/sync-scroll-panel/sync-scroll-panel.component';
import { ToolTableComponent } from './components/tool-table/tool-table.component';
import { UnFrozenTableComponent } from './components/unfrozen-table/unfrozen-table.component';
import { ColumResizerHandlerDirective } from './directives/colum-resizer-handler.directive';
import { DynamicStyleWidthDirective } from './directives/dynamic-style-width.directive';
import { ResizeTableColumnDirective } from './directives/resize-table-column.directive';
import { SortTableColumnDirective } from './directives/sort-table-column.directive';
import { TableStateRowDirective } from './directives/table-state-row.directive';
import { SyncScrollAreaDirective } from './directives/sync-scroll-area.directive';
import { InputModule as OrionInputModule, DynamicDialogModule as OrionDynamicDialogModule, FormModule as OrionFormModule, SelectModule as OrionSelectModule, ButtonModule as OrionButtonModule, CheckboxModule as OrionCheckboxModule, RadioButtonModule as OrionRadioButtonModule } from '@byzan/orion2';
import { TransferComponent } from './components/transfer/transfer.component';

@NgModule({
    declarations: [SortTableColumnDirective, ResizeTableColumnDirective, ColumResizerHandlerDirective, GridHeaderComponent, ColumnVisualEditingPanelComponent, ColumnFilterPanelComponent, FilterItemBoxComponent, FilterItemSettingPanelComponent, ColumnFilterViewEditPanelComponent, GridContentComponent, GridFooterComponent, DynamicStyleWidthDirective, GridComponent, SyncScrollPanelComponent, ToolTableComponent, UnFrozenTableComponent, FrozenTableComponent, OperationTableComponent, TableStateRowDirective, SyncScrollAreaDirective, TransferComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DragDropModule,
        ScrollingModule,
        // DynamicDialogModule,
        SlideMenuModule,
        PaginatorModule,
        ButtonModule,
        InputTextModule,
        OverlayPanelModule,
        SplitButtonModule,
        CheckboxModule,
        RadioButtonModule,
        DropdownModule,
        OrionInputModule,
        OrionDynamicDialogModule,
        OrionFormModule,
        OrionSelectModule,
        OrionButtonModule,
        OrionCheckboxModule,
        OrionRadioButtonModule
    ],
    providers: [
    ],
    exports: [
        GridComponent
    ],
    entryComponents: [
        ColumnVisualEditingPanelComponent,
        ColumnFilterPanelComponent,
        FilterItemBoxComponent,
        FilterItemSettingPanelComponent,
        ColumnFilterViewEditPanelComponent
    ]
})
export class GridModule { }
