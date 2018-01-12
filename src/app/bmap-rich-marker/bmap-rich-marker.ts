import { LoaderService } from 'meepo-loader';
import { EventService } from 'meepo-event';
import { UuidService } from 'meepo-uuid';

declare const BMap: any;
declare const BMapLib: any;
import {
    Component, AfterContentInit,
    ContentChild, TemplateRef, Input, ElementRef,
    EventEmitter, Output, ChangeDetectorRef,
    OnChanges, SimpleChanges, OnInit,
    ChangeDetectionStrategy, ContentChildren,
    QueryList, AfterContentChecked, ViewEncapsulation
} from '@angular/core';
import { NgForOfContext } from '@angular/common';
import { BMAP_LOCATION_SUCCESS, BMAP_LOADED } from '../event';
import { BmapContainerComponent } from '../bmap-container/bmap-container';
import { MarkerService } from '../marker.service';
@Component({
    selector: 'bmap-rich-marker',
    template: `
        <div class="bmap-info" (bmapAvatar)="bmapAvatar($event,item)" *ngFor="let item of _items">
            <img [src]="item.avatar"/>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./bmap-rich-marker.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapRichMarkerDirective {
    @Input() items: any;
    html: any;
    _items: any[] = [];
    id: string;

    pointMarker: any[] = [];
    constructor(
        public loader: LoaderService,
        public ele: ElementRef,
        public markerService: MarkerService,
        public uuid: UuidService,
        public cd: ChangeDetectorRef
    ) {
        this.id = this.uuid.v1();
    }

    bmapAvatar(item: any) {
    }

    ngOnInit() {
        this.items.subscribe(res => {
            this._items = res;
            this.cd.detectChanges();
            this.cd.detach();
        });
    }
}