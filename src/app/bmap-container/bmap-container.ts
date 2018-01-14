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

export const bmapContainerRoom = 'bmapContainerRoom';
import { SocketService } from 'meepo-event';

import {
    BMAP_INITED,
    BMAP_DRAGEND,
    BMAP_MOVEEND,
    BMAP_CLICK,
    BMAP_TITLES_LOADED,
    BMAP_WALKING_SEARCH_COMPLETE,
    BMAP_DRIVING_SEARCH_COMPLETE,
    BMAP_GEOC_GET_LOCATION,
    BMAP_GEOC_GET_POINT,
    BMAP_SET_CITY,
    BMAP_LOCATION_SUCCESS,
    BMAP_MY_LOCATION,
    BMAP_GEOHASH
} from '../event';
export const BMAP_DRIVING = 'BMAP_DRIVING';
export const BMAP_WALKING = 'BMAP_WALKING';

declare const BMap: any;
declare const require: any;
const geohash = require('ngeohash');
@Injectable()
@Component({
    selector: 'bmap-container,[bMap]',
    templateUrl: './bmap-container.html',
    styleUrls: ['./bmap-container.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapContainerComponent implements AfterContentInit {
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
        public store: StoreService,
        public event: SocketService
    ) {
        this.on((res: any) => {
            switch (res.type) {
                case BMAP_MY_LOCATION:
                    this.getCurrentPosition();
                    break;
                case BMAP_DRIVING:
                    this.driving.search(res.data.start, res.data.end);
                    break;
                case BMAP_WALKING:
                    this.walking.search(res.data.start, res.data.end);
                    break;
                default:
                    break;
            }
        });
    }

    private on(fn: Function) {
        this.event.on(bmapContainerRoom, fn);
    }

    private emit(data) {
        this.event.emit(bmapContainerRoom, data);
    }

    initCfg() {
        this.data = this.store.get(this.key, {
            key: 'Xo6mSiXtItekVGBfNLsedOR1ncASB4pV',
            point: {
                lng: 116.404,
                lat: 39.915
            }
        });
    }

    updateBmapConfig(data) {
        this.store.set(this.key, data);
    }

    ngAfterContentInit() {
        this.initCfg();
        this.initBmap();
    }

    initBmap() {
        if (window['BMap']) {
            this.createBmap();
        } else {
            window['initMap'] = () => {
                this.createBmap();
            }
            this.loader.import([`https://api.map.baidu.com/api?v=2.0&ak=${this.data.key}&callback=initMap`]).subscribe(res => { });
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
        this.bmap = new BMap.Map(this.ele.nativeElement, {
            minZoom: 18
        });
        let point = new BMap.Point(this.data.point.lng, this.data.point.lat);
        this.bmap.centerAndZoom(point, this.zoom);
        this.geolocation = new BMap.Geolocation();
        this.getCurrentPosition();
        // 发送地图初始化事件
        this.emit({ type: BMAP_INITED, data: this.bmap });
        this.bmap.addEventListener('dragend', (e) => {
            this.emit({ type: BMAP_DRAGEND, data: this.bmap.getCenter() });
        });
        this.bmap.addEventListener('moveend', (e) => {
            // 计算hash
            let point = this.bmap.getCenter();
            this.emit({ type: BMAP_MOVEEND, data: point });
        });
        this.bmap.addEventListener('click', (e) => {
            this.emit({ type: BMAP_CLICK, data: this.bmap.getCenter() })
        });
        this.bmap.addEventListener("tilesloaded", () => {
            let point = this.bmap.getCenter();
            let hash = geohash.encode(point.lat, point.lng, 4);
            this.emit({ type: BMAP_GEOHASH, data: hash });
            this.emit({ type: BMAP_TITLES_LOADED, data: this.bmap });
        });
        this.geoc = new BMap.Geocoder();
        this.walking = new BMap.WalkingRoute(this.bmap, {
            onSearchComplete: (results: any) => {
                if (this.walking.getStatus() == window['BMAP_STATUS_SUCCESS']) {
                    const plan = results.getPlan(0);
                    const data = {
                        deration: plan.getDuration(true),
                        distance: plan.getDistance(true),
                        resultes: results
                    };
                    this.emit({ type: BMAP_WALKING_SEARCH_COMPLETE, data: data });
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
                    this.emit({ type: BMAP_DRIVING_SEARCH_COMPLETE, data: data });
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
            this.emit({ type: BMAP_GEOC_GET_LOCATION, data: rs });
        });
    }
    // 地址转点
    getPoint(addr: string) {
        this.geoc.getPoint(addr, (point: any) => {
            this.emit({ type: BMAP_GEOC_GET_POINT, data: point });
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
            this.emit({ type: BMAP_SET_CITY, data: city });
            this.bmap.setCurrentCity(city);
            this.updateBmapConfig(this.data);
            this.bmap.panTo(r.point);
            // 成功定位
            this.emit({ type: BMAP_LOCATION_SUCCESS, data: r.point });
            // 计算hash
            let hash = geohash.encode(r.point.lat, r.point.lng, 6);
            this.emit({ type: BMAP_GEOHASH, data: hash });
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