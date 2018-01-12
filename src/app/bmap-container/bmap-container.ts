import {
    Component, OnInit,
    ViewEncapsulation, ViewChild, ElementRef,
    ChangeDetectorRef, EventEmitter, Output, OnDestroy,
    Input, Injectable, OnChanges, SimpleChanges, AfterContentInit
} from '@angular/core';
import { LoaderService } from 'meepo-loader';
import { MeepoCache } from 'meepo-base';
import { StoreService } from 'meepo-store';
import { Title } from '@angular/platform-browser';
import { EventService } from 'meepo-event';
import {
    BMAP_INITED, BMAP_GEOC_INITED,
    BMAP_LOCATION_SUCCESS, BMAP_LOADED,
    BMAP_MY_LOCATION, BMAP_SET_CITY, BMAP_GET_ADDRESS,
    BMAP_MOVEEND, BMAP_GEOC_GET_LOCATION, BMAP_GEOC_GET_POINT, BMAP_DRAGEND, BMAP_CLICK,
    BMAP_TITLES_LOADED, BMAP_DRIVING_SEARCH_COMPLETE, BMAP_WALKING_SEARCH_COMPLETE
} from '../event';

declare const BMap: any;
@Injectable()
@Component({
    selector: 'bmap-container,[bMap]',
    templateUrl: './bmap-container.html',
    styleUrls: ['./bmap-container.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapContainerComponent extends MeepoCache implements AfterContentInit {
    bmap: any;
    @ViewChild('container') ele: ElementRef;
    key: string = 'bmap.container';
    data: any;
    geolocation: any;
    LocalSearch: any;
    geoc: any;
    subs: any[] = [];
    @Input() zoom: number = 20;
    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor(
        public loader: LoaderService,
        store: StoreService,
        cd: ChangeDetectorRef,
        title: Title,
        public event: EventService
    ) {
        super(store, cd, title);
        let sub1 = this.event.subscribe(BMAP_MY_LOCATION, () => {
            // 回到我的位置
            this.getCurrentPosition();
        });
        this.subs.push(sub1);
    }

    meepoOnDestroy() {
        this.subs.map(sub => {
            this.event.unsubscribe(sub);
        });
    }

    meepoInit() {

    }

    initCfg() {
        let data = {
            key: 'Xo6mSiXtItekVGBfNLsedOR1ncASB4pV',
            point: {
                lng: 116.404,
                lat: 39.915
            }
        };
        this.updateCache(data);
    }

    ngAfterContentInit() {
        if (!this.data.key) {
            this.initCfg();
        }
        this.initBmap();
    }

    initBmap() {
        if (window['BMap']) {
            this.createBmap();
        } else {
            window['initMap'] = () => {
                this.createBmap();
            }
            this.loader.import([`https://api.map.baidu.com/api?v=2.0&ak=${this.data.key}&callback=initMap`]).subscribe(res => {

            });
        }
    }
    /**
     * 驾车规划器
     */
    driving: any;
    /**
     * 路线规划途径点
     */
    waypoints: any[] = [];
    /**
     * 步行规划器
     */
    walking: any;
    /**
     * 坐标转换器
     */
    convertor: any;
    createBmap() {
        this.bmap = new BMap.Map(this.ele.nativeElement);
        let point = new BMap.Point(this.data.point.lng, this.data.point.lat);
        this.bmap.centerAndZoom(point, this.zoom);
        this.geolocation = new BMap.Geolocation();
        this.getCurrentPosition();
        this.event.publish(BMAP_INITED, this.bmap);
        this.bmap.addEventListener('dragend', (e) => {
            this.event.publish(BMAP_DRAGEND, this.bmap.getCenter());
        });
        this.bmap.addEventListener('moveend', (e) => {
            this.event.publish(BMAP_MOVEEND, this.bmap.getCenter())
        });
        this.bmap.addEventListener('click', (e) => {
            this.event.publish(BMAP_CLICK, this.bmap.getCenter())
        });
        this.bmap.addEventListener("tilesloaded", () => {
            this.event.publish(BMAP_TITLES_LOADED, this.bmap);
        });
        this.geoc = new BMap.Geocoder();
        this.event.publish(BMAP_LOADED, this.bmap);
        this.walking = new BMap.WalkingRoute(this.bmap, {
            onSearchComplete: (results: any) => {
                if (this.walking.getStatus() == window['BMAP_STATUS_SUCCESS']) {
                    const plan = results.getPlan(0);
                    const data = {
                        deration: plan.getDuration(true),
                        distance: plan.getDistance(true),
                        resultes: results
                    };
                    this.event.publish(BMAP_WALKING_SEARCH_COMPLETE, data);
                }
            },
            waypoints: this.waypoints,
            renderOptions: {
                map: this.bmap,
                autoViewport: true,
                enableDragging: true,
            }
        });
        this.driving = new BMap.DrivingRoute(this.bmap, {
            onSearchComplete: (results: any) => {
                if (this.driving.getStatus() == window['BMAP_STATUS_SUCCESS']) {
                    const plan = results.getPlan(0);
                    const data = {
                        deration: plan.getDuration(true),
                        distance: plan.getDistance(true),
                        resultes: results
                    };
                    this.event.publish(BMAP_DRIVING_SEARCH_COMPLETE, data);
                }
            },
            waypoints: this.waypoints,
            renderOptions: {
                map: this.bmap,
                autoViewport: true,
                enableDragging: true,
            }
        });

        this.convertor = new BMap.Convertor();

        //添加控件
        this.bmap.addControl(new BMap.NavigationControl({ anchor: window['BMAP_ANCHOR_TOP_RIGHT'], type: window['BMAP_NAVIGATION_CONTROL_SMALL'] }));
    }

    addOverlay(marker: any) {
        this.bmap.addOverlay(marker);
    }

    setWaypoints(points: any[] = []) {
        this.waypoints = points;
    }
    // 点转地址
    getLocation(pt: any) {
        this.geoc.getLocation(pt, (rs: LocationInter) => {
            this.event.publish(BMAP_GEOC_GET_LOCATION, rs);
        });
    }
    // 地址转点
    getPoint(addr: string) {
        this.geoc.getPoint(addr, (point: any) => {
            this.event.publish(BMAP_GEOC_GET_POINT, point);
        });
    }
    // 驾车路线规划
    drivingRoute(p1: any, p2: any) {
        this.driving.search(p1, p2);
    }
    // 步行路线规划
    walkingRoute(p1: any, p2: any) {
        this.walking.search(p1, p2);
    }

    getCurrentPosition() {
        this.geolocation.getCurrentPosition((r) => {
            this.data.point = r.point;
            this.getLocation(r.point);
            let address = r.address;
            let city = address.city;
            // 设置城市
            this.event.publish(BMAP_SET_CITY, city);
            this.bmap.setCurrentCity(city);
            this.updateCache(this.data);
            this.bmap.panTo(r.point);
            // 成功定位
            this.event.publish(BMAP_LOCATION_SUCCESS, r.point)
        });
    }

    getCenter() {
        return this.bmap.getCenter();
    }
}

export interface PointInter {
    lat: number;
    lng: number;
}

export interface AddressInter {
    city: string;
    district: string;
    province: string;
    street: string;
    streetNumber: string;
}

export interface PoiInter {
    address: string;
    city: string;
    point: PointInter;
    title: string;
    Si: string;
    iu: string[];
}

export interface LocationInter {
    address: string;
    addressComponents: AddressInter;
    business: string;
    point: PointInter;
    surroundingPois: PoiInter[];
}