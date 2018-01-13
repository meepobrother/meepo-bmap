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
import { MarkerService } from './marker.service';

@Component({
    selector: 'bmap-rich-marker',
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ['./bmap-rich-marker.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapRichMarkerDirective {
    id: string;
    constructor(
        public uuid: UuidService
    ) {
        this.id = this.uuid.v1();
    }
}