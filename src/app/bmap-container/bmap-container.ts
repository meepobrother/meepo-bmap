import {
    Component, OnInit,
    ViewEncapsulation, ViewChild, ElementRef,
    ChangeDetectorRef
} from '@angular/core';
import { LoaderService } from 'meepo-loader';
import { MeepoCache } from 'meepo-base';
import { StoreService } from 'meepo-store';
import { Title } from '@angular/platform-browser';
import { EventService } from 'meepo-event';
import {
    BMAP_INITED, BMAP_GEOC_INITED,
    BMAP_LOCATION_SUCCESS, BMAP_LOADED,
    BMAP_MY_LOCATION
} from '../event';
declare const BMap: any;

@Component({
    selector: 'bmap-container',
    templateUrl: './bmap-container.html',
    styleUrls: ['./bmap-container.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapContainerComponent extends MeepoCache {
    bmap: any;

    key: string = 'bmap.container';
    data: any;
    geolocation: any;
    LocalSearch: any;
    geoc: any;

    constructor(
        public loader: LoaderService,
        public ele: ElementRef,
        store: StoreService,
        cd: ChangeDetectorRef,
        title: Title,
        public event: EventService
    ) {
        super(store, cd, title);
        this.event.subscribe(BMAP_MY_LOCATION,()=>{
            // 回到我的位置
            this.getCurrentPosition();
        });
    }

    meepoInit() {
        if (!this.data.key) {
            this.initCfg();
        }
        this.initBmap();
    }

    initCfg() {
        this.data = {
            key: 'Xo6mSiXtItekVGBfNLsedOR1ncASB4pV',
            point: {
                lng: 116.404,
                lat: 39.915
            }
        };
        this.updateCache(this.data);
    }

    initBmap() {
        if (window['BMap']) {
            this.createBmap();
            this.event.publish(BMAP_LOADED, BMap);
        } else {
            window['initMap'] = () => {
                this.createBmap();
                this.event.publish(BMAP_LOADED, BMap);
            }
            this.loader.import([`https://api.map.baidu.com/api?v=2.0&ak=${this.data.key}&callback=initMap`]).subscribe(res => { });
        }
    }

    createBmap() {
        this.bmap = new BMap.Map(this.ele.nativeElement);
        let point = new BMap.Point(this.data.point.lng, this.data.point.lat);
        this.bmap.centerAndZoom(point, 20);
        this.event.publish(BMAP_INITED, this.bmap);
        this.geolocation = new BMap.Geolocation();
        this.getCurrentPosition();
    }

    getCurrentPosition() {
        this.geolocation.getCurrentPosition((r) => {
            this.data.point = r.point;
            this.updateCache(this.data);
            this.bmap.panTo(r.point);
            this.event.publish(BMAP_LOCATION_SUCCESS, r.point)
        });
    }
}