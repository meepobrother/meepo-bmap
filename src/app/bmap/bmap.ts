import {
    Component, OnInit, ViewChild, ElementRef,
    ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy,
    Output, EventEmitter, TemplateRef, Input
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
    @Input() title: string = '在这里下单';
    @Input() height = 0;
    BMap: any;
    map: any;
    loading: boolean = true;
    btnTitle: string = this.title;
    loadObserver: any;
    constructor(
        public bmapService: BmapService,
        public cd: ChangeDetectorRef,
        public core: CoreService,
        public address: BmapAddressSelectService
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
            this.loading = false;
            this.core.closeLoading();
            this.cd.detectChanges();
        });
    }
    ngOnInit() {
        // 加载地图资源
        this.bmapService.loadBmapSrc();
        setTimeout(() => {
            this.core.showLoading({ type: 'skCircle', full: false });
            this.loading = true;
            this.cd.detectChanges();
        }, 0);
        this.bmapService.movestart$.subscribe(res => {
            setTimeout(() => {
                this.loading = true;
                this.btnTitle = this.title;
                this.core.showLoading({ show: true, full: false });
                this.cd.detectChanges();
            }, 0);
        });
        // 设置导航按钮高度
        this.bmapService.locationHeight = this.height;
    }
}
