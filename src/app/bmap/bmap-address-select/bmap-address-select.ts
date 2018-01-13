import {
    Component, OnInit, Input, ElementRef,
    ViewChild, ChangeDetectorRef, ChangeDetectionStrategy,
    Output, EventEmitter, TemplateRef, ContentChild,
    ViewEncapsulation, AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import { BmapService } from '../../bmap.service';
import { BmapAddressSelectService } from '../../bmap-address-select.service';
import { CoreService, CorePopoverWidget } from 'meepo-core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeLast';

import { Subject } from 'rxjs/Subject';
import { XscrollComponent } from 'meepo-xscroll';
import { MeepoHistory } from 'meepo-base';
import { StoreService } from 'meepo-store';

@Component({
    selector: 'bmap-address-select',
    templateUrl: './bmap-address-select.html',
    styleUrls: [
        './bmap-address-select.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class BmapAddressSelectComponent extends MeepoHistory {
    key: string = 'bmap.address.select';
    @ViewChild(XscrollComponent) xscroll: XscrollComponent;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Output() showChange: EventEmitter<any> = new EventEmitter();

    widget: any = {
        show: false,
        data: null
    };
    key$: Subject<any> = new Subject();

    items: any[] = [];
    psize: number = 5;
    max: number = 10;

    constructor(
        public bmapService: BmapService,
        public cd: ChangeDetectorRef,
        public core: CoreService,
        public address: BmapAddressSelectService,
        public store: StoreService
    ) {
        super(store, cd);
        this.key$.asObservable().subscribe(key => {
            this.core.showLoading({ type: 'skCircle' });
            this.searchByKey(key);
        });
        // 搜索结果
        this.bmapService.localSearch$.subscribe((res: any) => {
            if (res.getCurrentNumPois() > 0) {
                this.items = [];
                for (let i = 0; i < res.getCurrentNumPois(); i++) {
                    this.items.push(res.getPoi(i));
                }
                this.xscroll.onEnd();
                this.core.closeLoading();
                // this.cd.detectChanges();
            }
        });

        this.address.show$.asObservable().subscribe(res => {
            this.widget = { ...this.widget, ...res };
            // this.cd.detectChanges();
        });
    }

    meepoInit() {
        this.cd.markForCheck();
    }

    onKey(e: any) {
        this.key$.next(e.target.value);
    }

    _onCitySelect(item: any) {
        this.address.close(item);
        this.addItem(item);
    }

    _cancelSelect() {
        this.address.close(null);
    }

    searchByKey(key) {
        this.bmapService.LocalSearch.search(key);
    }
}