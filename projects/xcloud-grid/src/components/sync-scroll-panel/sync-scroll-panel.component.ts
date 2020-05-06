import { AfterContentInit, Component, ContentChildren, ElementRef, QueryList, Renderer2, TemplateRef, ViewChild, ComponentFactoryResolver, ComponentFactory, ViewContainerRef } from '@angular/core';
import { SyncScrollAreaDirective } from '../../directives/sync-scroll-area.directive';

@Component({
    selector: 'xcloud-grid-sync-scroll-panel',
    templateUrl: './sync-scroll-panel.component.html',
    styleUrls: ['./sync-scroll-panel.component.scss']
})
export class SyncScrollPanelComponent implements AfterContentInit {

    // @ViewChild('slavePanelContainer', { static: true, read: ViewContainerRef })
    // public slavePanelContainer: ViewContainerRef;
    // @ViewChild('masterPanelContainer', { static: true, read: ViewContainerRef })
    // public masterPanelContainer: ViewContainerRef;

    public slaveTemplates: Array<TemplateRef<any>> = [];
    public masterTemplates: Array<TemplateRef<any>> = [];
    @ContentChildren(SyncScrollAreaDirective)
    private scrollAreas: QueryList<SyncScrollAreaDirective>;
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
        this.scrollAreas.forEach(it => {
            // this.slaveTemplates.push(it.template);
            // console.log(1, it.type);
            if (it.type === 'master') {
                this.masterTemplates.push(it.template);
            } else {
                this.slaveTemplates.push(it.template);
            }
        });
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
        let clientHeight: number = this.masterPanel.nativeElement.clientHeight;
        let offsetHeight: number = this.masterPanel.nativeElement.offsetHeight;
        let scrollBarHeight: number = offsetHeight - clientHeight;
        // console.log('clientHeight', clientHeight);
        // console.log('offsetHeight', offsetHeight);
        this.renderer2.setStyle(this.placeholderBox.nativeElement, 'height', `${scrollBarHeight}px`);
    }

    // public createPanel(factories: Array<ComponentFactory<any>>): void {
    //     if (!factories || factories.length) { return; }

    //     for (let i = 1, len = factories.length; i < len; i++) {
    //         this.slavePanelContainer.createComponent();
    //     }
    // }

}
