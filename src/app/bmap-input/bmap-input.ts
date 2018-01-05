import {
    Component, OnInit, ViewEncapsulation,
    ChangeDetectorRef, ViewChild, ElementRef,
    Output, EventEmitter, OnDestroy
} from '@angular/core';
import { EventService } from 'meepo-event';
import {
    BMAP_LOADED, BMAP_INITED,
    BMAP_LOCATION_SUCCESS,
    BMAP_GET_ADDRESS,
    BMAP_GEOC_INITED
} from '../event';
declare const BMap: any;
import { LocationInter } from '../bmap-container/bmap-container';
@Component({
    selector: 'bmap-input',
    templateUrl: './bmap-input.html',
    styleUrls: ['./bmap-input.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapInputComponent implements OnInit, OnDestroy {
    ac: any;
    bmap: any;
    localSearch: any;
    geoc: any;
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('keyword') keyword: ElementRef;

    subscribes: any[] = [];
    constructor(
        public event: EventService,
        public cd: ChangeDetectorRef
    ) {
        let sub1 = this.event.subscribe(BMAP_INITED, (bmap) => {
            this.bmap = bmap;
        });

        let sub2 = this.event.subscribe(BMAP_GEOC_INITED, (geoc) => {
            this.geoc = geoc;
        });

        let sub3 = this.event.subscribe(BMAP_LOCATION_SUCCESS, () => {
            this.initAc();
        });

        let sub4 = this.event.subscribe(BMAP_GET_ADDRESS, (re: LocationInter) => {
            this.keyword.nativeElement.value = re.address;
        });

        this.subscribes.push(sub1);
        this.subscribes.push(sub2);
        this.subscribes.push(sub3);
        this.subscribes.push(sub4);

    }

    initAc() {
        if (!this.ac) {
            this.ac = new BMap.Autocomplete({
                "input": "keyword"
                , "location": this.bmap
            });
            this.localSearch = new BMap.LocalSearch(this.bmap, { //智能搜索
                onSearchComplete: (e) => {
                    let point = this.localSearch.getResults().getPoi(0).point;
                    this.bmap.panTo(point);
                    this.bmap.addOverlay(new BMap.Marker(point));
                }
            });
            this.ac.addEventListener('onconfirm', (e: any) => {
                let _value = e.item.value;
                let myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                this.ac.setInputValue(myValue);
                this.keyword.nativeElement.blur();
                this.ac.hide();
                this.change();
                this.geoc.getPoint(myValue, (point) => {
                    this.bmap.panTo(point);
                });
            });
        }
    }

    ngOnDestroy() {
        this.subscribes.map(sub => {
            this.event.unsubscribe(sub);
        });
    }

    ngOnInit() { }

    change() {
        this.onChange.emit(this.keyword.nativeElement.value);
    }

    getKey() {
        return this.keyword.nativeElement.value;
    }
}