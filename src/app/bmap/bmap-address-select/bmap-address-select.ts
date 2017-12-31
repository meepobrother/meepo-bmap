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
import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'bmap-address-select',
    templateUrl: './bmap-address-select.html',
    styleUrls: [
        './bmap-address-select.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class BmapAddressSelectComponent implements OnInit {
    @Input() items: any[] = [];
    @ViewChild('headerTpl') headerTpl: TemplateRef<any>;
    @ViewChild('bodyTpl') bodyTpl: TemplateRef<any>;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Output() showChange: EventEmitter<any> = new EventEmitter();
    widget: any = {
        show: false,
        data: null
    };
    timer: any;

    key$: Subject<any> = new Subject();

    constructor(
        public bmapService: BmapService,
        public cd: ChangeDetectorRef,
        public core: CoreService,
        public address: BmapAddressSelectService
    ) {
        this.key$.debounceTime(300).subscribe(key => {
            this.core.showLoading({ type: 'skCircle' });
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.core.closeLoading();
                this.core.showToast({ title: '没有结果', message: '没有找到相关地址', type: 'warning' });
            }, 3000);
            this.searchByKey(key);
        });
        // 搜索结果
        this.bmapService.localSearch$.subscribe((res: any) => {
            this.items = [];
            for (let i = 0; i < res.getCurrentNumPois(); i++) {
                this.items.push(res.getPoi(i));
            }
            let cfg: CorePopoverWidget = {
                tpl: this.bodyTpl,
                headerTpl: this.headerTpl,
                list: this.items
            };
            this.core.showPopover(cfg);
            this.core.closeLoading();
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.cd.markForCheck();
        });

        this.address.show$.subscribe(res => {
            this.widget = { ...this.widget, ...res };
            console.log(this.widget);
            if (this.widget.show) {
                let cfg: CorePopoverWidget = {
                    tpl: this.bodyTpl,
                    headerTpl: this.headerTpl,
                    list: this.items
                };
                this.core.showPopover(cfg);
            } else {
                this.core.closePopover();
            }
            this.cd.markForCheck();
        });
    }

    ngOnInit() {

    }
    onKey(e: any) {
        this.key$.next(e.target.value);
    }

    _clear() {
        
    }

    _onCitySelect(item: any) {
        this.address.close(item);
    }

    _cancelSelect() {
        this.address.close(null);
    }

    searchByKey(key) {
        this.bmapService.LocalSearch.search(key);
    }
}