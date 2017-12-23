import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BmapService } from '../../bmap.service';
import { CoreService } from 'meepo-core';
@Component({
    selector: 'bmap-address-select',
    templateUrl: './bmap-address-select.html',
    styleUrls: [
        './bmap-address-select.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BmapAddressSelectComponent implements OnInit {
    @Input() items: any[] = [];
    @ViewChild('search') search: ElementRef;
    constructor(
        public bmapService: BmapService,
        public cd: ChangeDetectorRef,
        public core: CoreService
    ) { 
        // 搜索结果
        this.bmapService.localSearch$.subscribe((res: any) => {
            for (let i = 0; i < res.getCurrentNumPois(); i++) {
                this.items.push(res.getPoi(i));
            }
            this.cd.detectChanges();
        });
    }

    ngOnInit() { }

    _change(){
        let key = this.search.nativeElement.value;
        this.searchByKey(key);
    }

    _clear(){
        this.search.nativeElement.value = '';
    }

    _onCitySelect(item: any) {

    }

    _cancelSelect(){
        this.core.closePopover();
    }

    searchByKey(key) {
        this.bmapService.LocalSearch.search(key);
    }
}