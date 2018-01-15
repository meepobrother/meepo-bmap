import {
    Component, OnInit, ViewEncapsulation,
    ElementRef, EventEmitter, Output, OnDestroy,
    ViewChild, Input
} from '@angular/core';
import { EventService } from 'meepo-event';
import { BMAP_MY_LOCATION, BMAP_INITED } from '../event';
@Component({
    moduleId: module.id,
    selector: 'bmap-footer',
    templateUrl: './bmap-footer.html',
    styleUrls: ['./bmap-footer.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapFooterComponent implements OnInit, OnDestroy {
    @Output() onInit: EventEmitter<number> = new EventEmitter();
    @Output() onSave: EventEmitter<any> = new EventEmitter();
    detail: string;
    address: string;
    bmap: any;
    @ViewChild('detail') _detail: ElementRef;
    subs: any[] = [];

    @Input()
    set model(val: string) {
        this._detail.nativeElement.value = val;
    }
    get model() {
        return this._detail.nativeElement.value;
    }


    constructor(
        public event: EventService,
        public ele: ElementRef
    ) {
        let sub1 = this.event.subscribe(BMAP_INITED, (bmap) => {
            this.bmap = bmap;
        });
        this.subs.push(sub1);
    }

    ngOnInit() {
        let height = this.ele.nativeElement.clientHeight
        this.onInit.emit(height);
    }

    onMyLocation() {
        this.event.publish(BMAP_MY_LOCATION, '');
    }

    ngOnDestroy() {
        this.subs.map(sub => {
            this.event.unsubscribe(sub);
        });
    }

    getDetail() {
        return this._detail.nativeElement.value;
    }
}