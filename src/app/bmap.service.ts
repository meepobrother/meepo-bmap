import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CoreService } from 'meepo-core';
import { Subject } from 'rxjs/Subject';
import { AxiosService } from 'meepo-axios';
import { StoreService } from 'meepo-store';

export const loadMaps: any = {};
export interface BMapComponent {
    street?: string;
}
@Injectable()
export class BmapService {
    key: string = 'Xo6mSiXtItekVGBfNLsedOR1ncASB4pV';
    serviceKey: string = 'RG62whHySODgV1Mq1jHhDFBkBLyjglQu';
    bmap: any;
    load$: Subject<any> = new Subject();
    initMap$: Subject<any> = new Subject();
    // 定位成功
    locationSuccess$: Subject<any> = new Subject();
    // 定位失败
    locationError$: Subject<any> = new Subject();

    moveend$: Subject<any> = new Subject();
    movestart$: Subject<any> = new Subject();
    carMoving$: Subject<any> = new Subject();
    move$: Subject<any> = new Subject();

    centerChange$: Subject<any> = new Subject();
    getAddress$: Subject<any> = new Subject();
    localSearch$: Subject<any> = new Subject();

    getRoutePlanSuccess$: Subject<any> = new Subject();
    BMap: any;
    // 默认参数
    zoom: number = 22;
    myLocation: any = {
        lng: 116.404,
        lat: 39.915
    };
    geolocationControl: any;
    geoc: any;
    geolocation: any;
    locationHeight: number = 100;
    LocalSearch: any;
    riding: any;

    time: any = new Date().getTime();
    constructor(
        @Inject(DOCUMENT) public document: any,
        public core: CoreService,
        public axios: AxiosService,
        public store: StoreService
    ) {
        this.myLocation = this.store.get('__my_location', {
            lng: 116.404,
            lat: 39.915
        });
        this.initMap$.subscribe(res => {
            // 初始化地图后， 调整地图中心， 初始化数据
            // 调整地图参数
            this.BMap = window['BMap'];
            this.initMapSetting();
        });
        // 成功获取位置时
        this.locationSuccess$.subscribe((location: any) => {
            // this.bmap.clearOverlays();
        });
        // 地图移动获取移动后的地图中心位置
        this.moveend$.asObservable().subscribe(res => {
            this.centerChange();
        });
    }

    clearOverlays() {
        this.bmap.clearOverlays();
    }

    getRoutePlan(start: any, end: any) {
        // 替代
        // this.riding.search(start, end);
        const plan$: Subject<any> = new Subject();
        const url = `http://api.map.baidu.com/direction/v1` +
            `?mode=driving` +
            `&origin=${start.point.lat},${start.point.lng}` +
            `&destination=${end.point.lat},${end.point.lng}` +
            `&mode=riding` +
            `&origin_region=${start.city}` +
            `&destination_region=${end.city}` +
            `&output=json` +
            `&ak=${this.serviceKey}`;
        const meepoUrl = `https://meepo.com.cn/app/index.php?c=entry&i=2&do=open&__do=cloud.getCloudUrl2&m=imeepos_runner`;
        this.axios.post(meepoUrl, { url: url }).subscribe((result: any) => {
            let res = result;
            if (res && res.info) {
                const info = res.info;
                if (info && info.message === 'ok') {
                    const result = info.result;
                    const routes = result.routes;
                    if (routes && routes.length > 0 && routes[0]) {
                        plan$.next(routes[0]);
                    } else {
                        this.core.showToast({
                            title: '路线规划失败',
                            message: '请输入有效地址!',
                            type: 'warning',
                            location: 'top-right'
                        });
                        plan$.next({ steps: [] });
                    }
                }
            }
        });
        return plan$;
    }

    addLine(points: any[]) {
        this.bmap.clearOverlays();
        points = points || [];
        if (points.length > 0) {
            this.bmap.addOverlay(new this.BMap.Polyline(points, { strokeColor: '#111' }));
        }
    }

    panTo(point) {
        this.bmap.panTo(point);
    }

    getLocation(pt: any) {
        this.geoc.getLocation(pt, (rs) => {
            this.getAddress$.next(rs);
        });
    }

    centerChange() {
        const point = this.bmap.getCenter();
        const bound = this.getBounds();
        this.centerChange$.next({ point: point, bound: bound });
        this.getLocation(point);
    }

    getCurrentPosition(hasPan: boolean = true) {
        this.geolocation.getCurrentPosition((r) => {
            this.store.set('__my_location', r.point);
            if (hasPan) {
                this.bmap.panTo(r.point);
            } else {
                this.getLocation(r.point);
            }
        });
    }
    initMapSetting() {
        this.geolocationControl = new this.BMap.GeolocationControl({
            anchor: window['BMAP_ANCHOR_TOP_LEFT'],
            enableAutoLocation: true,
            offset: new this.BMap.Size(10, this.locationHeight)
        });
        this.geolocationControl.addEventListener("locationSuccess", (e) => {
            // 定位成功
            this.locationSuccess$.next(e);
        });
        this.geolocationControl.addEventListener("locationError", (e) => {
            // 定位失败
            this.core.showToast({
                title: '定位失败',
                message: '请检查您的GPS是否开启!',
                type: 'info',
                position: 'top-right'
            });
            this.locationError$.next(e);
        });
        this.geoc = new this.BMap.Geocoder();
        this.geolocation = new this.BMap.Geolocation();
        this.LocalSearch = new this.BMap.LocalSearch(this.bmap, {
            onSearchComplete: (results: any) => {
                if (this.LocalSearch.getStatus() === window['BMAP_STATUS_SUCCESS']) {
                    this.localSearch$.next(results);
                }
            }
        });

        this.getCurrentPosition();
        this.bmap.centerAndZoom(new this.BMap.Point(this.myLocation.lng, this.myLocation.lat), this.zoom);
        // 定位空间
        this.bmap.addControl(this.geolocationControl);
        this.bmap.enableDragging();
        // 监听地图移动事件
        this.bmap.addEventListener('moveend', (e) => {
            this.moveend$.next(e);
        });

        this.bmap.addEventListener('movestart', (e) => {
            this.movestart$.next(e);
        });

        this.bmap.addEventListener('resize', (e) => {
            this.moveend$.next(e);
        });

        this.bmap.addEventListener('zoomend', (e) => {
            this.moveend$.next(e);
        });

        this.bmap.addEventListener('click', (e) => {
            this.panTo(e.point);
        });

        this.riding = new this.BMap.WalkingRoute(this.bmap, {
            renderOptions: {
                map: this.bmap,
                autoViewport: false
            },
            onSearchComplete: (results: any) => {
                console.log(this.riding.getResults());
            },
            onPolylinesSet: (results: any) => {
                console.log(results);
            }
        });
    }

    getBounds() {
        const bs = this.bmap.getBounds();
        // 可视区域左下角
        const bssw = bs.getSouthWest();
        // 可视区域右上角
        const bsne = bs.getNorthEast();
        return {
            top: {
                lat: bsne.lat,
                lng: bsne.lng
            },
            bottom: {
                lat: bssw.lat,
                lng: bssw.lng
            }
        };
    }

    loadLushu() {
        const lushu$: Subject<any> = new Subject();
        this._loadSrc(`http://api.map.baidu.com/library/LuShu/1.2/src/LuShu_min.js`, 'BMapLib', () => {
            lushu$.next(window['BMapLib']);
        });
        return lushu$;
    }

    // 加载地图
    loadBmapSrc() {
        window['initMap'] = () => {
            this.load$.next({ name: 'BMap', libs: window['BMap'] });
        };
        this._loadSrc(`https://api.map.baidu.com/api?v=2.0&ak=${this.key}&callback=initMap`, 'BMap_loadScriptTime', () => { });
        return this;
    }

    _loadSrc(src: string, name: string, cb?: any) {
        if (loadMaps[name]) {
            this.load$.next({ name: name, libs: loadMaps[name] });
        } else {
            const script = this.document.createElement('script');
            script.src = src;
            script.type = 'text/javascript';
            script.onload = () => {
                loadMaps[name] = window[name];
                if (cb) {
                    cb(window[name]);
                } else {
                    this.load$.next({ name: name, libs: window[name] });
                }
            };
            this.document.getElementsByTagName('head')[0].appendChild(script);
        }
        return this;
    }

}
