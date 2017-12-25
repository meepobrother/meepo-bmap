import {
    Component, OnInit, ChangeDetectionStrategy,
    ChangeDetectorRef, Input, ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'bmap-order-info',
    templateUrl: './bmap-order-info.html',
    styleUrls: [
        './bmap-order-info.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class BmapOrderInfoComponent implements OnInit {
    showOrderDetail: boolean = false;
    @Input()
    set show(val: boolean) {
        this.showOrderDetail = val;
        this.cd.markForCheck();
    }
    get show() {
        return this.showOrderDetail;
    }

    @Input() timePrice: any = {};
    @Input() juliItems: any[] = [];
    constructor(
        public cd: ChangeDetectorRef
    ) { }

    ngOnInit() { }

    switchShowOrderDetail() {
        this.showOrderDetail = !this.showOrderDetail;
        this.cd.detectChanges();
    }
}