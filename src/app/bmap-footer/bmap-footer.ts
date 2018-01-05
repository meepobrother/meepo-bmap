import {
    Component, OnInit, ViewEncapsulation,
    ElementRef, EventEmitter, Output
} from '@angular/core';
import { EventService } from 'meepo-event';
import { BMAP_MY_LOCATION, BMAP_FOOTER_MORE } from '../event';
@Component({
    selector: 'bmap-footer',
    templateUrl: './bmap-footer.html',
    styleUrls: ['./bmap-footer.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapFooterComponent implements OnInit {
    @Output() onInit: EventEmitter<number> = new EventEmitter();
    constructor(
        public event: EventService,
        public ele: ElementRef
    ) { }

    ngOnInit() {
        let height = this.ele.nativeElement.clientHeight
        console.log(height);
        this.onInit.emit(height);
    }

    onMyLocation() {
        this.event.publish(BMAP_MY_LOCATION, '');
    }

    onFooterMore() {
        this.event.publish(BMAP_FOOTER_MORE, '');
    }
}