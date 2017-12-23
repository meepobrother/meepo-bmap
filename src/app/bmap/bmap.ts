import {
    Component, OnInit, ViewChild, ElementRef,
    ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy,
    Output, EventEmitter, TemplateRef
} from '@angular/core';
import { BmapService } from '../bmap.service';
import { headerTitles } from './bmap.config';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ApiService } from '../api.service';
import { BmapAddressSelectService } from '../bmap-address-select.service';
import { RunnerService } from '../runner.service';
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
    @ViewChild('footer') footer: ElementRef;
    @ViewChild('search') search: ElementRef;

    @Output() onHome: EventEmitter<any> = new EventEmitter();
    @Output() onFinish: EventEmitter<any> = new EventEmitter();

    showOrderDetail: boolean = false;

    BMap: any;
    map: any;

    loading: boolean = true;
    btnTip: string = '2分钟';
    btnTitle: string = '在这里下单';
    component: any;

    address$: any;

    headerTitles: any[] = headerTitles;
    activeTitle: any;
    activeNav: any;

    showSearch: boolean = false;
    showNotice: boolean = false;
    surroundingPois: any[] = [];

    start: any = {
        point: {},
        address: ''
    };
    end: any = {
        point: {},
        address: ''
    };
    ruleContent: string;
    juliItems: any[] = [];
    timePrice: any;
    distance: any = 0;
    duration: any = 0;
    isStart: boolean = true;
    form: FormGroup;

    // 开始位置流
    start$: Subject<any> = new Subject();
    // 结束位置流
    end$: Subject<any> = new Subject();

    lushu: any;

    // 监听者
    startEndCombineObserver: any;
    carMovingObserver: any;
    startObserver: any;
    endObserver: any;
    loadObserver: any;

    loaded: boolean = true;

    constructor(
        public bmapService: BmapService,
        public cd: ChangeDetectorRef,
        public fb: FormBuilder,
        public api: ApiService,
        public runner: RunnerService,
        public core: CoreService,
        public address: BmapAddressSelectService
    ) {
        this.cd.detach();
        this.core.loading$.subscribe(res=>{
            this.loaded = res.show;
        });
        this.address.show$.subscribe((res: any) => {
            let item = res.data;
            if (item) {
                if (this.isStart) {
                    this.start$.next({ address: item.title, point: item.point, city: item.city });
                    this.bmapService.panTo(item.point);
                } else {
                    this.end$.next({ address: item.title, point: item.point, city: item.city });
                }
            }
        });
        // 地图初始化
        this.loadObserver = this.bmapService.load$.subscribe((res: any) => {
            const BMap = res.libs;
            this.BMap = BMap;
            this.bmapService.bmap = new BMap.Map(this.bmap.nativeElement);
            this.map = this.bmapService.bmap;
            this.bmapService.initMap$.next(true);
            this.loadObserver.unsubscribe();
        });
        // 顶部菜单
        this.headerTitles.map(res => {
            if (res.active) {
                this.activeTitle = res;
            }
        });

        this.carMovingObserver = this.bmapService.carMoving$.subscribe(res => {
            if (res) {
                this.destoryInstance();
            } else {
                this.startInstance();
            }
        });

        this.startInstance();
        // 分类信息
        this.runner.class$.subscribe(res => {
            this.headerTitles.map(title => {
                if (title.code === 'runner') {
                    if (res && res.length > 0) {
                        title.items = res;
                        let hasActive = false;
                        title.items.map(item => {
                            if (item.active) {
                                hasActive = true;
                            }
                        });
                        if (!hasActive) {
                            this._onNavItem(title.items[0]);
                        }
                    }
                }
            });
            this.cd.detectChanges();
        });

        this.runner.getDistanceSuccess$.subscribe((juliitems: any[]) => {
            this.juliItems = juliitems;
            this.cd.detectChanges();
        });

        this.runner.timePriceSuccess$.subscribe((timePrice: any) => {
            this.timePrice = timePrice;
            this.cd.detectChanges();
        });
    }
    // 注销
    destoryInstance() {
        this.startEndCombineObserver.unsubscribe();
        this.startObserver.unsubscribe();
        this.endObserver.unsubscribe();
    }
    // 初始化
    startInstance() {
        this.startObserver = this.start$.subscribe(start => {
            this.start = start;
        });
        this.endObserver = this.end$.subscribe(end => {
            this.end = end;
        });
        // 合并开始 和结束位置流
        this.startEndCombineObserver = this.start$.asObservable().combineLatest(this.end$.asObservable()).subscribe(res => {
            // 计算距离 路径规划
            this.bmapService.getRoutePlan(res[0], res[1]).subscribe(routes => {
                this.distance = Math.floor(routes.distance / 10) / 100;
                this.duration = Math.floor(routes.duration / 60);
                this.btnTitle = `总路程:${this.distance}公里`;
                this.getDistancePrice();
                let arrPois = [];
                routes.steps.map(step => {
                    const stepOriginLocation = step.stepOriginLocation;
                    const stepDestinationLocation = step.stepDestinationLocation;
                    arrPois = [
                        ...arrPois,
                        new this.BMap.Point(stepOriginLocation.lng, stepOriginLocation.lat),
                        new this.BMap.Point(stepDestinationLocation.lng, stepDestinationLocation.lat)
                    ];
                });
                this.bmapService.addLine(arrPois);
                this.core.closeLoading();
                this.cd.detectChanges();
            });
        });
    }

    getDistancePrice() {
        // 计算路程价格
        if (this.distance > 0 && this.activeNav
            && this.activeNav.setting && this.activeNav.setting.setting && this.activeNav.setting.setting.juliItems) {
            this.runner.distance$.next({
                distance: this.distance,
                duration: this.duration,
                juliItems: this.activeNav.setting.setting.juliItems
            });
            if (this.distance > 0) {
                this.showOrderDetail = true;
            }
        }
    }

    getTimePrice() {
        if (this.activeNav && this.activeNav.setting && this.activeNav.setting.setting && this.activeNav.setting.setting.juliItems) {
            this.runner.timePrice({
                date: new Date(),
                timeItems: this.activeNav.setting.setting.timeItems
            });
        }
    }
    // 选择目的地
    _onEndAddressSelect() {
        this.isStart = false;
        this.showAddressSelect();
    }
    // 选择开始地
    _onStartAddressSelect() {
        this.isStart = true;
        this.showAddressSelect();
    }
    // 选择地址
    showAddressSelect() {
        this.address.show();
    }
    // 头部点击
    _onHeaderItem(item: any) {
        this.headerTitles.map(res => {
            res.active = false;
        });
        item.active = !item.active;
        this.activeTitle = item;
        this.cd.detectChanges();
    }
    // 头部导航
    _onNavItem(item: any) {
        this.activeTitle.items.map(res => {
            res.active = false;
        });
        item.active = !item.active;
        this.activeNav = item;
        this.getDistancePrice();
        this.getTimePrice();
        this.cd.detectChanges();
    }

    showRuleContent() {
        if (this.activeNav && this.activeNav.setting && this.activeNav.setting.rule && !this.loaded) {
            this.ruleContent = this.activeNav.setting.rule.content;
            this.showNotice = true;
            this.cd.detectChanges();
        }
    }

    switchShowOrderDetail() {
        this.showOrderDetail = !this.showOrderDetail;
        this.cd.detectChanges();
    }

    switchNotice() {
        this.showNotice = !this.showNotice;
        this.cd.detectChanges();
    }

    locationToHome() {
        this.onHome.emit();
    }

    finish() {
        this.onFinish.emit({
            start: this.start,
            end: this.end,
            distance: this.distance,
            duration: this.duration,
            timePrice: this.timePrice,
            juliItems: this.juliItems
        });
    }

    ngOnInit() {
        // 加载地图资源
        this.bmapService.loadBmapSrc();
        this.runner.runnerClass();
        setTimeout(() => {
            this.loading = true;
            this.cd.detectChanges();
        }, 0);
        // 获取当前位置成功
        this.bmapService.getAddress$.asObservable().debounceTime(300).subscribe((res: any) => {
            this.component = res.addressComponents;
            this.surroundingPois = res.surroundingPois;
            this.start$.next({ address: res.address, point: res.point, city: res.addressComponents.city });
            if (this.component && this.component.street === "") {
                this.component.street = '定位失败，请重新拖动地图选择位置！';
            }
            if (!this.end.address) {
                this.core.closeLoading();
            }
            this.loading = false;
            this.cd.detectChanges();
        });
        // 开始移动
        this.bmapService.movestart$.subscribe(res => {
            this.core.showLoading({ type: 'skCircle' });
            setTimeout(() => {
                this.loading = true;
                this.btnTitle = '在这里下单';
                this.showOrderDetail = false;
                this.cd.detectChanges();
            }, 0);
        });
        // 设置导航按钮高度
        this.bmapService.locationHeight = this.footer.nativeElement.clientHeight + 20;
    }
}
