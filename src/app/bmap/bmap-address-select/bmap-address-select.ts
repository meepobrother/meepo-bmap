import {
    Component, OnInit, Input, ElementRef,
    ViewChild, ChangeDetectorRef, ChangeDetectionStrategy,
    Output, EventEmitter, TemplateRef, ContentChild,
    ViewEncapsulation
} from '@angular/core';
import { BmapService } from '../../bmap.service';
import { BmapAddressSelectService } from '../../bmap-address-select.service';

import { CoreService, CorePopoverWidget } from 'meepo-core';
import { FormGroup, FormBuilder } from '@angular/forms';

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
    form: FormGroup;
    @Output() showChange: EventEmitter<any> = new EventEmitter();
    widget: any = {
        show: false,
        data: null
    };
    constructor(
        public bmapService: BmapService,
        public cd: ChangeDetectorRef,
        public core: CoreService,
        public fb: FormBuilder,
        public address: BmapAddressSelectService
    ) {
        this.form = this.fb.group({
            key: ''
        });
        this.form.get('key').valueChanges.subscribe(key => {
            this.searchByKey(key);
        })
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
            this.cd.markForCheck();
        });

        this.address.show$.subscribe(res => {
            this.widget = { ...this.widget, ...res };
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

    ngOnInit() { }

    _clear() {
        this.form.get('key').setValue('');
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