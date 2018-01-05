import {
    Component, OnInit, ViewChild, ElementRef,
    ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy,
    Output, EventEmitter, TemplateRef, Input, Renderer2, OnDestroy
} from '@angular/core';
import { BmapService } from '../bmap.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CoreService, CorePopoverWidget } from 'meepo-core';
import { LoaderService } from 'meepo-loader';
declare const BMap: any;

@Component({
    selector: 'bmap',
    templateUrl: './bmap.html',
    styleUrls: ['./bmap.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BmapComponent implements OnInit, OnDestroy {
    @ViewChild('bmap') bmap: ElementRef;
    @ViewChild('content') content: ElementRef;
    @ViewChild('tip') tip: ElementRef;

    @Input() title: string = '在这里下单';
    @Input() height = 0;
    BMap: any;
    map: any;
    btnTitle: string = this.title;
    loadObserver: any;
    bmapServiceObserver: any;
    constructor(
        public bmapService: BmapService,
        public cd: ChangeDetectorRef,
        public core: CoreService,
        public render: Renderer2,
        public loader: LoaderService
    ) {
        this.bmapService.getAddress$.subscribe(res => {
            this.btnTitle = res.address;
            this.updateUi();
            this.cd.detectChanges();
        });
    }

    ngOnInit() {
        this.initBmap();
        this.core.showLoading({ show: true, type: 'skCircle', full: false });
        this.bmapServiceObserver = this.bmapService.movestart$.subscribe(res => {
            setTimeout(() => {
                this.btnTitle = this.title;
                this.updateUi(true);
            }, 0);
        });
        this.bmapService.locationHeight = this.height;
    }
    /**
     * 初始化地图
     */
    initBmap() {
        if (window['BMap']) {
            this.createBmap(BMap);
        } else {
            window['initMap'] = () => {
                this.createBmap(BMap);
            }
            this.loader.import(['https://api.map.baidu.com/api?v=2.0&ak=Xo6mSiXtItekVGBfNLsedOR1ncASB4pV&callback=initMap']).subscribe(res => { });
        }
    }
    createBmap(BMap: any) {
        this.BMap = this.BMap || BMap;
        this.bmapService.bmap = new this.BMap.Map(this.bmap.nativeElement);
        this.map = this.bmapService.bmap;
        this.bmapService.initMap$.next(true);
    }

    ngOnDestroy() {
        this.loadObserver.unsubscribe();
        this.bmapServiceObserver.unsubscribe();
    }

    updateUi(isLoading: boolean = false) {
        this.core.showLoading({ show: true, full: false });
        this.render.setStyle(this.tip.nativeElement, 'visibility', 'hidden');
    }

    getWidth(e: any) {
        let width = 30 + e;
        this.render.setStyle(this.tip.nativeElement, 'margin-left', '-' + width / 2 + 'px');
        this.core.closeLoading();
        setTimeout(() => {
            this.render.setStyle(this.tip.nativeElement, 'visibility', 'visible');
        }, 300);
    }
}
