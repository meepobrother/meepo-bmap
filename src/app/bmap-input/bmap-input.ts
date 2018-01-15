import {
    Component, OnInit, ViewEncapsulation,
    ChangeDetectorRef, ViewChild, ElementRef,
    Output, EventEmitter, OnDestroy, Input
} from '@angular/core';
import { SocketService } from 'meepo-event';
import {
    BMAP_LOADED, BMAP_INITED,
    BMAP_LOCATION_SUCCESS,
    BMAP_GET_ADDRESS,
    BMAP_GEOC_INITED, BMAP_MOVEEND
} from '../event';
declare const BMap: any;
import { LocationInter } from '../bmap-container/bmap-container';
import { bmapContainerRoom } from '../bmap-container/bmap-container';
export const bmapInputRoom = 'bmapInputRoom';
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
    geoc: any;
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('keyword') keyword: ElementRef;

    _isEdit: boolean = false;
    _key: string;
    @Input()
    set model(val: string) {
        if (val) {
            this._key = val;
            this.keyword.nativeElement.value = val;
            this._isEdit = true;
        }
    }

    subscribes: any[] = [];
    constructor(
        public event: SocketService,
        public cd: ChangeDetectorRef
    ) {
        this.event.on(bmapContainerRoom, (res) => {
            switch (res.type) {
                case BMAP_INITED:
                    this.bmap = res.data;
                    break;
                case BMAP_GEOC_INITED:
                    this.geoc = res.data;
                    break;
                case BMAP_LOCATION_SUCCESS:
                    this.initAc();
                    break;
                case BMAP_GET_ADDRESS:
                    if (!this._isEdit) {
                        this.keyword.nativeElement.value = res.data.address;
                    }
                    break;
                case BMAP_MOVEEND:
                    this._isEdit = false;
                    break;
                default:
                    break;
            }
        });
    }

    private on(fn: Function) {
        this.event.on(bmapInputRoom, fn)
    }

    private emit(data: any) {
        this.event.emit(bmapInputRoom, data);
    }

    initAc() {
        if (!this.ac) {
            this.ac = new BMap.Autocomplete({
                "input": "keyword"
                , "location": this.bmap
            });
            if (this._isEdit) {
                this.ac.setInputValue(this._key);
            }
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

    ngOnInit() { }

    change() {
        this.onChange.emit(this.keyword.nativeElement.value);
    }

    getKey() {
        return this.keyword.nativeElement.value;
    }
}