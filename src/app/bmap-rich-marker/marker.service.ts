import { Injectable } from '@angular/core';
import { SocketService } from 'meepo-event';
import { LoaderService } from 'meepo-loader';
import { BMAP_INITED } from '../event';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/switchMap";
import 'rxjs/add/operator/map';
import { from } from 'rxjs/observable/from';
import { bmapContainerRoom } from '../bmap-container/bmap-container.module';
// 常数
export const bmapRichMarkerRoom = 'bmapRichMarkerRoom';

export const BMAP_RICH_MARKER_ADD_RUNNERS = 'BMAP_RICH_MARKER_INITED';
export const BMAP_RICH_MARKER_LOADED = 'BMAP_RICH_MARKER_LOADED';
export const BMAP_RICH_MARKER_RUNNERS_ADDED = 'BMAP_RICH_MARKER_RUNNERS_ADDED';
export const BMAP_RICH_MARKER_CLICK = 'BMAP_RICH_MARKER_CLICK';

declare const BMapLib: any;
declare const BMap: any;

@Injectable()
export class MarkerService {
    markers: any[] = [];
    bmap: any;
    markerClusterer: any;
    loadInited: Subject<any> = new Subject();

    maxDistance: number = 300;
    showInfo: Subject<any> = new Subject();
    i: number = 0;
    sn: any = new Date().getTime();
    constructor(
        public event: SocketService,
        public loader: LoaderService,
    ) {
        this.event.on(bmapContainerRoom, (res: any) => {
            switch (res.type) {
                case BMAP_INITED:
                    this.bmap = res.data;
                    this.loadMarker();
                    break;
                default:
                    break;
            }
        });
        this.on((res) => {
            switch (res.type) {
                case BMAP_RICH_MARKER_ADD_RUNNERS:
                    this.addPointMarkers(res.data);
                    break;
                default:
                    break;
            }
        });
    }

    private on(fn: Function) {
        this.event.on(bmapRichMarkerRoom, fn)
    }

    private emit(data: any) {
        this.event.emit(bmapRichMarkerRoom, data);
    }

    loadMarker() {
        if (window['BMapLib']) {
            this.emit({ type: BMAP_RICH_MARKER_LOADED, data: window['BMapLib'] });
        } else {
            this.loader.importLocals([
                './TextIconOverlay.js',
                './RichMarker.js',
                './MarkerClusterer.js'
            ]).subscribe(res => {
                if (res) {
                    this.createMarkerClusterer();
                    this.emit({ type: BMAP_RICH_MARKER_LOADED, data: window['BMapLib'] });
                }
            });
        }
    }

    setMarkers(val: any[]) {
        this.markers = val;
    }
    minMax: any;
    addPointMarkers(runners: any[] = []) {
        this.minMax = this.getBounds();
        try {
            this.bmap.clearOverlays();
            this.markers = [];
        } catch (e) { }
        runners.map(runner => {
            this.addPointMarker(runner);
        });
        this.emit({ type: BMAP_RICH_MARKER_RUNNERS_ADDED, data: this.markers });
    }

    addPointMarker(e: any) {
        try {
            let distance = this.checkDistance(new BMap.Point(e.lng, e.lat));
            if (distance) {
                let marker = new BMapLib.RichMarker(
                    `<div class="bmap-info"><img src="${e.avatar}"/></div>`,
                    new BMap.Point(e.lng, e.lat), {
                        "anchor": new BMap.Size(-15, -50),
                        "enableDragging": false
                    }
                );
                this.markers = [...this.markers, marker];
                marker.addEventListener("onclick", () => {
                    this.emit({ type: BMAP_RICH_MARKER_CLICK, data: e });
                });
                this.bmap.addOverlay(marker);
            }
        } catch (e) {
            console.dir(e);
        }
    }

    checkDistance(p2): boolean {
        let distance = this.getDistance(p2);
        let lat = p2.lat > this.minMax.lat.min && p2.lat < this.minMax.lat.max;
        let lng = p2.lng > this.minMax.lng.min && p2.lng < this.minMax.lng.max;
        if (lat && lng) { 
            return true;
        }else{
            return false;
        }
        // return distance < this.maxDistance;
    }
    getDistance(p2): number {
        return 0;
    }

    getBounds() {
        let bound = this.bmap.getBounds();
        let bounds = {
            bottom: bound.getSouthWest(),
            top: bound.getNorthEast()
        }
        let minLat = Math.min(bounds.bottom.lat, bounds.top.lat);
        let maxLat = Math.max(bounds.bottom.lat, bounds.top.lat);
        let minLng = Math.min(bounds.bottom.lng, bounds.top.lng);
        let maxLng = Math.max(bounds.bottom.lng, bounds.top.lng);
        return {
            lat: { min: minLat, max: maxLat },
            lng: { min: minLng, max: maxLng }
        }
    }

    removeMarker(e) {
        this.markers.splice(this.markers.indexOf(e), 1);
        this.bmap.removeOverlay(e);
    }

    createMarkerClusterer() {
        this.markerClusterer = new BMapLib.MarkerClusterer(
            this.bmap, {
                markers: this.markers
            }
        );
    }
}
