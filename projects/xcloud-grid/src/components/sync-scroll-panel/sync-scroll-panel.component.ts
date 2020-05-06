import { AfterContentInit, Component, ContentChildren, ElementRef, QueryList, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { SyncMasterScrollAreaDirective } from '../../directives/sync-master-scroll-area.directive';
import { SyncSlaveScrollAreaDirective } from '../../directives/sync-slave-scroll-area.directive';

@Component({
    selector: 'xcloud-grid-sync-scroll-panel',
    templateUrl: './sync-scroll-panel.component.html',
    styleUrls: ['./sync-scroll-panel.component.scss']
})
export class SyncScrollPanelComponent implements AfterContentInit {

    public slaveTemplates: Array<TemplateRef<any>> = [];
    public masterTemplate: TemplateRef<any>;
    // @ContentChildren(SyncSlaveScrollAreaDirective)
    // private slaveAreas: QueryList<SyncSlaveScrollAreaDirective>;
    // @ContentChildren(SyncMasterScrollAreaDirective)
    // private masterAreas: QueryList<SyncMasterScrollAreaDirective>;
    @ViewChild('slavePanel', { static: true, read: ElementRef })
    private slavePanel: ElementRef;
    @ViewChild('masterPanel', { static: true, read: ElementRef })
    private masterPanel: ElementRef;
    @ViewChild('placeholder', { static: true, read: ElementRef })
    private placeholderBox: ElementRef;
    public constructor(
        private renderer2: Renderer2
    ) {

    }

    public ngAfterContentInit(): void {
        // this.slaveAreas.forEach(it => {
        //     this.slaveTemplates.push(it.template);
        // });
        // this.masterAreas.forEach(it => this.masterTemplate = it.template);

        let lastScrollTop: number = 0;
        this.masterPanel.nativeElement.addEventListener('scroll', e => {
            let top: number = e.target.scrollTop;
            if (lastScrollTop === top) { return; }
            this.slavePanel.nativeElement.scrollTop = top;
            // console.log('m', top);
            lastScrollTop = top;
        });

        this.slavePanel.nativeElement.addEventListener('scroll', e => {
            let top: number = e.target.scrollTop;
            if (lastScrollTop === top) { return; }
            this.masterPanel.nativeElement.scrollTop = top;
            // console.log('s', top);
            lastScrollTop = top;
        });
    }

    public revirseScroll(): void {
        // let clientHeight: number = this.masterPanel.nativeElement.clientHeight;
        // let offsetHeight: number = this.masterPanel.nativeElement.offsetHeight;
        // let scrollBarHeight: number = offsetHeight - clientHeight;
        // // console.log('clientHeight', clientHeight);
        // // console.log('offsetHeight', offsetHeight);
        // this.renderer2.setStyle(this.placeholderBox.nativeElement, 'height', `${scrollBarHeight}px`);
    }

}
