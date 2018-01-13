import { Injectable } from '@angular/core';
import { SocketService } from 'meepo-event';
import { LoaderService } from 'meepo-loader';
import { BMAP_LOADED } from '../event';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/switchMap";
import 'rxjs/add/operator/map';
import { from } from 'rxjs/observable/from';
import { bmapContainerRoom } from '../bmap-container/bmap-container.module';
export const bmapRichMarkerRoom = 'bmapRichMarkerRoom';
export const BMAP_RICH_MARKER_ADD_RUNNERS = 'BMAP_RICH_MARKER_INITED';
declare const BMapLib: any;
declare const BMap: any;

@Injectable()
export class MarkerService {
    markers: any[] = [];
    bmap: any;
    markerClusterer: any;
    loadInited: Subject<any> = new Subject();

    constructor(
        public event: SocketService,
        public loader: LoaderService
    ) {
        this.event.on(bmapContainerRoom, (res: any) => {
            switch (res.type) {
                case BMAP_LOADED:
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
        this.loader.importLocals([
            './TextIconOverlay.js',
            './RichMarker.js',
            './MarkerClusterer.js'
        ]).subscribe(res => {
            if (res) {
                this.createMarkerClusterer();
            }
            this.loadInited.next(res);
        });
    }

    setMarkers(val: any[]) {
        this.markers = val;
    }

    i: number = 0;
    addPointMarkers(runners: any[] = []) {
        try {
            this.bmap.clearOverlays();
            this.markers = [];
        } catch (e) { }
        runners.map(runner => {
            this.addPointMarker(runner);
        });
    }

    maxDistance: number = 300;
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
                    this.showInfoDetail(e);
                });
                this.bmap.addOverlay(marker);
            }
        } catch (e) {
            console.dir(e);
        }
    }
    showInfo: Subject<any> = new Subject();
    showInfoDetail(e) {
        this.showInfo.next(e);
    }

    checkDistance(p2): boolean {
        let distance = this.getDistance(p2);
        return distance < this.maxDistance;
    }
    getDistance(p2): number {
        let p1 = this.bmap.getCenter();
        return this.bmap.getDistance(p1, p2);
    }

    getBounds() {
        let bounds = this.bmap.getBounds();
        return {
            bottom: bounds.getSouthWest(),
            top: bounds.getNorthEast()
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
