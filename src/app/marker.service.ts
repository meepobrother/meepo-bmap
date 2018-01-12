import { Injectable } from '@angular/core';
import { EventService } from 'meepo-event';
import { LoaderService } from 'meepo-loader';

import { BMAP_LOADED } from './event';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/switchMap";
import { from } from 'rxjs/observable/from';
import 'rxjs/add/operator/map';


declare const BMapLib: any;
declare const BMap: any;
@Injectable()
export class MarkerService {
    markers: any[] = [];
    bmap: any;
    markerClusterer: any;

    loadInited: Subject<any> = new Subject();

    constructor(
        public event: EventService,
        public loader: LoaderService
    ) {
        this.event.subscribe(BMAP_LOADED, (res) => {
            this.bmap = res;
            this.loadMarker();
        });
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
        } catch (e) {

        }
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

    addMarker(e: any) {

        // console.log(this.markers);
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
        // console.log(this.markerClusterer);
    }
}