import {
    Component, OnInit, ViewChild, ElementRef,
    ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy,
    Output, EventEmitter, TemplateRef, Input, Renderer2
} from '@angular/core';
import { BmapService } from '../bmap.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BmapAddressSelectService } from '../bmap-address-select.service';
import { CoreService, CorePopoverWidget } from 'meepo-core';

@Component({
    selector: 'bmap',
    templateUrl: './bmap.html',
    styleUrls: ['./bmap.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BmapComponent implements OnInit {
    @ViewChild('bmap') bmap: ElementRef;
    @ViewChild('content') content: ElementRef;
    @ViewChild('tip') tip: ElementRef;

    @Input() title: string = '在这里下单';
    @Input() height = 0;
    BMap: any;
    map: any;
    btnTitle: string = this.title;
    loadObserver: any;
    constructor(
        public bmapService: BmapService,
        public cd: ChangeDetectorRef,
        public core: CoreService,
        public address: BmapAddressSelectService,
        public render: Renderer2
    ) {
        this.cd.detach();
        // 地图初始化
        this.loadObserver = this.bmapService.load$.subscribe((res: any) => {
            const BMap = res.libs;
            this.BMap = BMap;
            this.bmapService.bmap = new BMap.Map(this.bmap.nativeElement);
            this.map = this.bmapService.bmap;
            this.bmapService.initMap$.next(true);
            this.loadObserver.unsubscribe();
        });
        this.bmapService.getAddress$.subscribe(res => {
            this.btnTitle = res.surroundingPois.length > 0 ? res.surroundingPois[0].address + '(' + res.surroundingPois[0].title + ')' : res.address;
            this.updateUi();
            this.core.closeLoading();
            this.cd.detectChanges();
        });
    }
    ngOnInit() {
        this.bmapService.loadBmapSrc();
        setTimeout(() => {
            this.core.showLoading({ type: 'skCircle', full: false });
            this.cd.detectChanges();
        }, 0);
        this.bmapService.movestart$.subscribe(res => {
            setTimeout(() => {
                this.btnTitle = this.title;
                this.updateUi(true);
                this.core.showLoading({ show: true, full: false });
            }, 0);
        });
        this.bmapService.locationHeight = this.height;
    }

    updateUi(isLoading: boolean = false) {
        this.render.setStyle(this.tip.nativeElement, 'visibility', 'hidden');
    }

    getWidth(e: any) {
        let width = 30 + e;
        this.render.setStyle(this.tip.nativeElement, 'margin-left', '-' + width / 2 + 'px');
        setTimeout(() => {
            this.render.setStyle(this.tip.nativeElement, 'visibility', 'visible');
        }, 300);
    }
}
