import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EventService } from 'meepo-event';
import { BMAP_LOADED, BMAP_INITED } from '../event';
declare const BMap: any;
@Component({
    selector: 'bmap-input',
    templateUrl: './bmap-input.html',
    styleUrls: ['./bmap-input.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapInputComponent implements OnInit {
    ac: any;
    bmap: any;
    localSearch: any;
    constructor(
        public event: EventService
    ) {
        this.event.subscribe(BMAP_INITED, (bmap) => {
            this.bmap = bmap;
            this.ac = new BMap.Autocomplete({
                "input": "keyword"
                , "location": bmap
            });

            this.localSearch = new BMap.LocalSearch(this.bmap, { //智能搜索
                onSearchComplete: (e) => {
                    let point = this.localSearch.getResults().getPoi(0).point;
                    this.bmap.panTo(point);
                    this.bmap.addOverlay(new BMap.Marker(point));
                }
            });
            this.ac.addEventListener('onconfirm', (e) => {
                let _value = e.item.value;
                let myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                this.setLocation(myValue);
            });
        });
    }
    ngOnInit() { }

    setLocation(val: string) {
        this.bmap.clearOverlays();
        this.localSearch.search(val);
    }
}