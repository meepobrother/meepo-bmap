import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Injector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MeepoCache } from 'meepo-base';
import { StoreService } from 'meepo-store';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'bmap-address-search',
    templateUrl: './bmap-address-search.html',
    styleUrls: ['./bmap-address-search.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BmapAddressSearchComponent extends MeepoCache {
    key$: Subject<any> = new Subject();
    key: string = 'bmap.address.search';
    // 关键词历史记录
    keyWordHistoryKey: string = 'bmap.address.search.key';
    keywords: string[] = [];

    data: any[] = [];
    constructor(
        store: StoreService,
        cd: ChangeDetectorRef,
        title: Title,
        public injector: Injector
    ) {
        super(injector);
        this.key$.debounceTime(300).subscribe(res => {
            this.search(res);
        });
    }

    ngOnInit() { }

    _cancelSelect() { }

    _onCitySelect(e: any) {

    }

    search(key: string) {
        console.log(key);
    }

    onKey(e: any) {
        let key = e.target.value;
        this.key$.next(key);
    }

    down(e: any) {
        e.next(false);
    }

    up(e: any) {
        e.next(true);
    }
}
